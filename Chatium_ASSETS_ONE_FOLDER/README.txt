# Chatium assets single-folder export

This folder contains all files from project /assets flattened into one directory.
Use MAP.txt to map runtime paths (/assets/...) to filenames in this folder.

Image optimization status:
- WebP assets were generated and wired in current source where applicable.
- Duplicate JPG/JPEG files were removed where same-name WEBP files exist.
- JPG/JPEG files are kept only when WEBP counterparts are absent.

Total files: 152

Important:
- Keep filenames exactly as-is when uploading to your storage.
- Runtime code still references /assets/... paths; this folder is a transfer/export package.
