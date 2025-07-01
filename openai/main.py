from agents import Agent, Runner
from openai import OpenAI
from pathlib import Path
import datetime
import base64

# s = datetime.datetime.now().isoformat()

# print(s)
# exit(0)

instructions = "You are a helpful assistant."

def main():
    do_me_an_image()
    # do_me_some_audio()



image_prompts = {
    "radiohead-cat": "A cat tied to a stick that's driven into frozen winter shit.",
    "radiohead-pig": "Calm fitter, healthier and more productive a pig in a cage on antibiotics.",
    "java-main": "An artistic interpretation of the inside of a computer circuit, with bright neon colors and glowing circuits, beginning to execute the main function of a Java program."
}


def do_me_an_image():
    client = OpenAI()
    img = client.images.generate(
        model="gpt-image-1",
        prompt=image_prompts["java-main"],
        n=1,
        size="1024x1024",
        moderation='low'
    )
    image_bytes = base64.b64decode(img.data[0].b64_json)
    time_str = datetime.datetime.now().isoformat()
    with open("openai-" + time_str + ".png", "wb") as f:
        f.write(image_bytes)


speech_tones = {
    "authoritative": "Use a calm, even, and authoritative tone.",
    "disdainful": "Use a tone of disdain, as if you are looking down on the subject.",
}
def do_me_some_audio():
    client = OpenAI()
    time_str = datetime.datetime.now().isoformat()
    speech_file_path = Path(__file__).parent / ("openai-" + time_str + ".mp3")
    with client.audio.speech.with_streaming_response.create(
        model="gpt-4o-mini-tts",
        voice="onyx",
        input="Donde está the library? I need to check out some books. Mostly on ornithology. It's really important to me, so if you could help me find it, I would be very grateful.",
        instructions=speech_tones["disdainful"],
        ) as response:
        response.stream_to_file(speech_file_path)

def text_prompt_to_agent():
    agent = Agent(name="Assistant", instructions=instructions)
    result = Runner.run_sync(agent, "Will the US bombing Iranian nuclear facilities lead to a broader conflict involving the US?")
    print(result.final_output)

if __name__ == "__main__":
    main()
