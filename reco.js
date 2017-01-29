const record = require('node-record-lpcm16')
const request = require('request');

const witToken = process.env.WIT_TOKEN;
const witai_url = `https://api.wit.ai/speech?client=chromium&lang=en-us&output=json`;


let parseResult = (err, resp, body) => {

  let result = JSON.parse(body)._text;

  if(result!==null) {
    console.log(`😛 ${result}`);
    request.post(`${process.env.TRANSCRIPTION_RECEIVER_URL}/general`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "@k33g_org",
        message: result
      })
    })
  } else {
    console.log(`😡 what❓`);
  } // end if

} // end parseResult

// listen
let startRecording = () => {
  console.log("🐼 start recording...")
  record.start({
    verbose : true
  }).pipe(request.post({
    url: `${witai_url}`,
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + witToken,
      "Content-Type": "audio/wav"
    }
  }, parseResult))
}

startRecording()
//setInterval(startRecording, 4000);
