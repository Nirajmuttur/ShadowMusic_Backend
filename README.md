
# Shadow Music Backend

Shadow Music uses Spotify Api to get playlist track and download from youtube. 


## API Reference

#### Get Playlist Tracks items

```http
  GET /api/playlist/{id}/tracks
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`      | `string` | **Required**. Playlist Id  |


## Run Locally

Clone the project

```bash
  git clone https://github.com/Nirajmuttur/ShadowMusic_Backend
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start-dev
```



