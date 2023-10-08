from fastapi import FastAPI, UploadFile, File, Form
from moviepy.editor import VideoFileClip
import asyncio
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/process_video/")
async def process_video(video: UploadFile, text_input: str = Form(...)):
    if not video.content_type.startswith("video/"):
        return {"error": "Invalid file format. Please provide a video file."}

    try:
        with open("uploaded_video.mp4", "wb") as video_file:
            video_file.write(video.file.read())

        async def generate_text():
            # Simulate some video processing
            # await asyncio.sleep(5)  # Simulate a 5-second processing time

            # Incorporate the text input into the response
            result_text = "Your answer was correct"
            
            return result_text

        text_result = await generate_text()

        return {"result": text_result}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
