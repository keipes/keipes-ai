from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google import genai
from google.genai import types
from openai import OpenAI
from PIL import Image
from io import BytesIO
import base64
import datetime
import os
import tempfile
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for Electron app

# Configuration
GEMINI_API_KEY = "AIzaSyCMfFR3zzuqcjqx2jjLbs6Rpz5Tqff8Juk"
OPENAI_API_KEY = None  # Will be set from frontend

# Global clients
gemini_client = None
openai_client = None

def init_gemini_client():
    global gemini_client
    if not gemini_client:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    return gemini_client

def init_openai_client(api_key=None):
    global openai_client
    if api_key and not openai_client:
        openai_client = OpenAI(api_key=api_key)
    return openai_client

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat(),
        'services': {
            'gemini': gemini_client is not None,
            'openai': openai_client is not None
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint using Gemini"""
    try:
        data = request.json
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        client = init_gemini_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=message
        )
        
        return jsonify({
            'response': response.text,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({'error': f'Chat failed: {str(e)}'}), 500

@app.route('/api/generate-image/gemini', methods=['POST'])
def generate_image_gemini():
    """Generate image using Gemini"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        client = init_gemini_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE']
            )
        )
        
        # Extract image data
        image_data = None
        text_response = None
        
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                text_response = part.text
            elif part.inline_data is not None:
                image_data = part.inline_data.data
        
        if not image_data:
            return jsonify({'error': 'No image generated'}), 500
        
        # Save image to temporary file
        time_str = datetime.datetime.now().isoformat()
        image = Image.open(BytesIO(image_data))
        
        # Create temp file
        temp_dir = tempfile.gettempdir()
        filename = f'gemini-image-{time_str}.png'
        filepath = os.path.join(temp_dir, filename)
        image.save(filepath)
        
        # Convert to base64 for response
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'image_base64': img_base64,
            'text_response': text_response,
            'filename': filename,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Gemini image generation error: {str(e)}")
        return jsonify({'error': f'Image generation failed: {str(e)}'}), 500

@app.route('/api/generate-image/openai', methods=['POST'])
def generate_image_openai():
    """Generate image using OpenAI"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        api_key = data.get('api_key', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if not api_key:
            return jsonify({'error': 'OpenAI API key is required'}), 400
        
        client = OpenAI(api_key=api_key)
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard"
        )
        
        # Get the image URL
        image_url = response.data[0].url
        
        # If b64_json is available, use that instead
        if hasattr(response.data[0], 'b64_json') and response.data[0].b64_json:
            img_base64 = response.data[0].b64_json
        else:
            # Download the image from URL and convert to base64
            import requests
            img_response = requests.get(image_url)
            img_base64 = base64.b64encode(img_response.content).decode()
        
        time_str = datetime.datetime.now().isoformat()
        filename = f'openai-image-{time_str}.png'
        
        return jsonify({
            'image_base64': img_base64,
            'image_url': image_url,
            'filename': filename,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"OpenAI image generation error: {str(e)}")
        return jsonify({'error': f'Image generation failed: {str(e)}'}), 500

@app.route('/api/config', methods=['POST'])
def update_config():
    """Update API keys and configuration"""
    try:
        data = request.json
        global OPENAI_API_KEY
        
        if 'openai_api_key' in data:
            OPENAI_API_KEY = data['openai_api_key']
            # Test the key by initializing client
            if OPENAI_API_KEY:
                init_openai_client(OPENAI_API_KEY)
        
        return jsonify({
            'message': 'Configuration updated successfully',
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Config update error: {str(e)}")
        return jsonify({'error': f'Configuration update failed: {str(e)}'}), 500

@app.route('/api/providers', methods=['GET'])
def get_providers():
    """Get available AI providers"""
    return jsonify({
        'providers': [
            {
                'id': 'gemini',
                'name': 'Google Gemini',
                'capabilities': ['chat', 'image_generation'],
                'available': True
            },
            {
                'id': 'openai',
                'name': 'OpenAI',
                'capabilities': ['image_generation'],
                'available': OPENAI_API_KEY is not None
            }
        ]
    })

if __name__ == '__main__':
    print("🚀 Starting Keipes AI Backend Server...")
    print("📡 Server will be available at: http://localhost:5001")
    print("🔗 Electron app should connect automatically")
    print("💡 Use Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
