// mylifeHQ — on-phone dream transcription (v3.35, 24 Nov 2026)
// © 2026 LUNAMOR PTY LTD. All rights reserved.
// Runs OpenAI's Whisper (base, English) inside the phone's browser through
// Transformers.js. The model downloads once (about 75 MB) and is then kept on
// the phone, so transcription works offline. The audio is not sent anywhere.
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
env.useBrowserCache = true;
try { env.backends.onnx.wasm.numThreads = 1; } catch (e) {}

const MODEL = 'Xenova/whisper-base.en';
let asrPromise = null;

function getAsr(id) {
  if (!asrPromise) {
    asrPromise = pipeline('automatic-speech-recognition', MODEL, {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: p => {
        if (p.status === 'progress' && /\.onnx$/.test(p.file || '')) {
          self.postMessage({ id, type: 'progress', file: p.file, progress: p.progress });
        }
      },
    }).catch(err => { asrPromise = null; throw err; });
  }
  return asrPromise;
}

self.onmessage = async (e) => {
  const { id, audio } = e.data;
  try {
    self.postMessage({ id, type: 'status', text: 'Loading the transcriber…' });
    const asr = await getAsr(id);
    self.postMessage({ id, type: 'status', text: 'Transcribing on this phone… keep the app open' });
    const out = await asr(audio, { chunk_length_s: 30, stride_length_s: 5 });
    self.postMessage({ id, type: 'done', text: (out && out.text ? out.text : '').trim() });
  } catch (err) {
    self.postMessage({ id, type: 'error', text: String((err && err.message) || err) });
  }
};
