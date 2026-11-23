# Run with Docker

1. Install and start Docker Desktop, using Linux containers.
2. Open PowerShell in the folder containing `compose.yaml`.
3. Stop any previous local Node server using port 8080 (Ctrl+C in its terminal).
4. Run `docker compose up -d --build`.
5. Open http://ccna.localhost:8080 in Edge or Chrome.

The topic, exam and weakness modes are also available at:

- http://topics.ccna.localhost:8080
- http://exam.ccna.localhost:8080
- http://weakness.ccna.localhost:8080

Useful commands:

```powershell
docker compose ps
docker compose logs -f
docker compose down
```

Node.js runs inside the container; it does not need to be installed on Windows. The first build needs Internet access to pull the Node image. The container uses the prebuilt `index.html`, so Python and `npm install` are not required.

The server listens on `0.0.0.0` inside the container so Docker can forward requests. The published port binds to `127.0.0.1:8080` for local testing. No Docker volume is needed: study history lives in your browser, not the container. Export progress in the app for backup. Using the same browser and `http://ccna.localhost:8080` retains the same origin as the earlier Node setup. File-opened HTML has a separate storage context; export/import to move that progress.

If the local names do not resolve, add this line to the Windows hosts file using an administrator editor:

```
127.0.0.1 ccna.localhost topics.ccna.localhost exam.ccna.localhost weakness.ccna.localhost
```

After changing app source, regenerate `index.html` with `build.py` before rebuilding the image. Run `docker compose up -d --build` to deploy the updated image.
