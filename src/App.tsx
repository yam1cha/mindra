import { useState, useEffect, useRef } from 'react';
import { pipeline, TextGenerationPipeline } from '@huggingface/transformers';

function App() {
  const [status, setStatus] = useState('準備中...');
  const [output, setOutput] = useState('');
  const generatorRef = useRef<TextGenerationPipeline | null>(null);

  // 1. AIモデルのロード（WebGPUを使う設定）
  useEffect(() => {
    (async () => {
      try {
        setStatus('AIモデルをダウンロード中... (初回は数分かかります)');
        
        // ここでモデルを指定！
        generatorRef.current = await pipeline(
          'text-generation',
          'onnx-community/Qwen2.5-0.5B-Instruct',
          { device: 'webgpu' } // ★ここが重要！GPUを使う設定
        );
        
        setStatus('AIの準備完了！🤖');
      } catch (err) {
        setStatus('エラーが発生しました😭 WebGPUが使える環境か確認してね。');
        console.error(err);
      }
    })();
  }, []);

  // 2. AIに話しかける関数
  const runAI = async () => {
    if (!generatorRef.current) return;
    
    setStatus('考え中...');
    const messages = [
      { role: "system", content: "あなたは親切なアシスタントのひなたです。日本語で答えてください。" },
      { role: "user", content: "こんにちは！自己紹介をして。" },
    ];

    const result = await generatorRef.current(messages, {
      max_new_tokens: 100, // 生成する長さ
    });

    // 結果を表示（型定義は省略してるけど、result[0].generated_textに入るよ）
    // @ts-ignore
    setOutput(result[0].generated_text.at(-1).content);
    setStatus('完了！');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>AI Browser Prototype 🚀</h1>
      <p>ステータス: <strong>{status}</strong></p>
      
      <button onClick={runAI} disabled={status !== 'AIの準備完了！🤖'} style={{ padding: '10px 20px', fontSize: '16px' }}>
        AIを起動する
      </button>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>AIの返答:</h3>
        <p>{output}</p>
      </div>
    </div>
  );
}

export default App;