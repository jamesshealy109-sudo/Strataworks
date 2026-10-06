"""Package public sales media from the existing fictional narrated tutorial exports.
Usage: python scripts/build-backflow-sales-media.py --source PATH --ffmpeg PATH
No new recording, provider calls, or customer data are used.
"""
import argparse, hashlib, json, re, shutil, subprocess, tempfile
from pathlib import Path

def stamp(seconds):
    value = max(0, round(seconds * 1000))
    h, value = divmod(value, 3600000)
    m, value = divmod(value, 60000)
    s, ms = divmod(value, 1000)
    return f"{h:02}:{m:02}:{s:02}.{ms:03}"

def seconds(value):
    h, m, s = value.replace(",", ".").split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)

def cues(path):
    result = []
    for block in re.split(r"\n\s*\n", path.read_text(encoding="utf-8-sig").strip()):
        lines = block.splitlines()
        index = next((i for i, line in enumerate(lines) if " --> " in line), None)
        if index is not None:
            start, end = lines[index].split(" --> ")
            result.append((seconds(start), seconds(end), "\n".join(lines[index + 1:])))
    return result

def write_vtt(path, entries):
    path.write_text("WEBVTT\n\n" + "\n\n".join(f"{stamp(start)} --> {stamp(end)}\n{text}" for start, end, text in entries) + "\n", encoding="utf-8")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--ffmpeg", required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    output = root / "backflow-operations-platform" / "media"
    output.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((args.source / "narration-manifest.json").read_text(encoding="utf-8"))
    tutorials = {item["id"]: item for item in manifest["tutorials"]}
    def run(*command):
        subprocess.run([args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *(f"{arg:.6f}" if isinstance(arg, float) else str(arg) for arg in command)], check=True)
    full = [("09-field-test", "field-test"), ("10-review-report", "review-report"), ("11-invoice-payment", "invoice-payment")]
    assets = []
    for tid, name in full:
        source = args.source / tid
        video = output / f"{name}.mp4"
        shutil.copyfile(source / "video.mp4", video)
        write_vtt(output / f"{name}.vtt", cues(source / "narration.srt"))
        shutil.copyfile(source / "transcript.txt", output / f"{name}-transcript.txt")
        scene = tutorials[tid]["scenes"][0]
        run("-ss", scene["outcome_time"] + 2, "-i", video, "-frames:v", "1", "-vf", "scale=960:-2", "-q:v", "3", output / f"{name}-poster.jpg")
        assets.append({"name": name, "source_tutorial": tid, "duration_seconds": tutorials[tid]["duration"]})
    selected = [("06-first-customer", "customer", "Customer records"), ("08-schedule-job", "assign", "Schedule the visit"), ("09-field-test", "readings", "Field results"), ("10-review-report", "pdf", "Approved report"), ("11-invoice-payment", "invoice", "Linked invoice")]
    total, captions, chapters, transcript = 0.0, [], [], []
    with tempfile.TemporaryDirectory(prefix="backflow-sales-") as temporary:
        files = []
        for index, (tid, sid, title) in enumerate(selected):
            scene = next(s for s in tutorials[tid]["scenes"] if s["id"] == sid)
            duration = scene["end"] - scene["start"]
            fragment = Path(temporary) / f"{index}.mp4"
            # Uniform frames and audio permit reliable concatenation of desktop and phone footage.
            run("-ss", scene["start"], "-i", args.source / tid / "video.mp4", "-t", duration,
                "-vf", "scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=0x07101c,setsar=1",
                "-af", f"afade=t=in:st=0:d=0.08,afade=t=out:st={max(0, duration - 0.12)}:d=0.12",
                "-r", "24", "-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", fragment)
            files.append(fragment)
            chapters.append({"title": title, "start_seconds": round(total, 3)})
            for start, end, text in cues(args.source / tid / "narration.srt"):
                if start < scene["end"] and end > scene["start"]:
                    captions.append((total + max(0, start - scene["start"]), total + min(duration, end - scene["start"]), text))
            transcript.append(title + "\n" + scene["text"])
            total += duration
        listing = Path(temporary) / "concat.txt"
        listing.write_text("\n".join("file '" + str(path).replace("\\", "/") + "'" for path in files), encoding="utf-8")
        run("-f", "concat", "-safe", "0", "-i", listing, "-c", "copy", "-movflags", "+faststart", output / "product-tour.mp4")
    write_vtt(output / "product-tour.vtt", captions)
    (output / "product-tour-transcript.txt").write_text("\n\n".join(transcript) + "\n", encoding="utf-8")
    run("-ss", "3", "-i", output / "product-tour.mp4", "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", output / "product-tour-poster.jpg")
    assets.append({"name": "product-tour", "duration_seconds": round(total, 3), "chapters": chapters})
    hashes = {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted(output.iterdir()) if path.is_file() and path.name != "manifest.json"}
    (output / "manifest.json").write_text(json.dumps({"fictional_demo_data": True, "source_release": "2026-10-04-v1", "assets": assets, "sha256": hashes}, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"assets": assets, "total_bytes": sum(path.stat().st_size for path in output.iterdir() if path.is_file())}))
if __name__ == "__main__":
    main()
