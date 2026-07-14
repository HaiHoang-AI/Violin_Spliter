import os
import shutil
import subprocess
import tempfile
import gradio as gr

def separate_audio(audio_file):
    if audio_file is None:
        return None, None
        
    # Create temp directory
    temp_dir = tempfile.mkdtemp()
    
    # Copy file to temporary directory
    input_filename = os.path.basename(audio_file)
    input_path = os.path.join(temp_dir, input_filename)
    shutil.copy(audio_file, input_path)
    
    # Demucs output folder
    output_dir = os.path.join(temp_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    
    # Run Demucs: 2 stems model (vocals = lead violin, accompaniment = orchestra)
    cmd = [
        "demucs",
        "-n", "htdemucs",
        "--two-stems", "vocals",
        input_path,
        "-o", output_dir
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)
    
    # Locate output files
    model_dir = os.path.join(output_dir, "htdemucs")
    subdirs = os.listdir(model_dir)
    if not subdirs:
        return None, None
    
    track_dir = os.path.join(model_dir, subdirs[0])
    
    vocals_file = os.path.join(track_dir, "vocals.wav")
    accompaniment_file = os.path.join(track_dir, "no_vocals.wav")
    
    return vocals_file, accompaniment_file

# Create the Gradio interface
demo = gr.Interface(
    fn=separate_audio,
    inputs=gr.Audio(type="filepath", label="Tải lên bản thảo âm nhạc (Upload Audio)"),
    outputs=[
        gr.Audio(label="Tiếng vĩ cầm chính (Violin / Lead Stem)"),
        gr.Audio(label="Nhạc nền dàn nhạc (Accompaniment Stem)")
    ],
    title="Stradivarius Pastoral AI - Audio Separation Studio",
    description="Tách tiếng đàn vĩ cầm chính khỏi dàn nhạc sử dụng mô hình AI Demucs."
)

if __name__ == "__main__":
    demo.launch()
