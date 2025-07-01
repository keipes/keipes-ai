from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
import datetime

api_key = ""

def main():
    do_me_an_image()


def do_me_an_image():
    client = genai.Client(api_key=api_key)
    contents = ("A bald eagle with a cannon on its back. The sun setting over purple mountains. The eagle is flying over a field of wheat.")
    response = client.models.generate_content(
        model="gemini-2.0-flash-preview-image-generation",
        contents=contents,
        config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE']
        )
    )
    time_str = datetime.datetime.now().isoformat()
    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = Image.open(BytesIO((part.inline_data.data)))
            image.save('gemini-native-image-' + time_str + '.png')
            image.show()

def do_me_some_chat():
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents="Will the US bombing Iranian nuclear facilities lead to a broader conflict involving the US?"
    )
    print(response.text)

if __name__ == "__main__":
    main()
