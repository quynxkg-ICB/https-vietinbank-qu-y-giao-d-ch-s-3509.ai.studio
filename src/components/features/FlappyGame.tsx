import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Copy,
  Check,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
} from 'lucide-react';
import { FlappyConfig } from '../../types';

interface FlappyGameProps {
  config: FlappyConfig;
}

// Global window callbacks as requested in specification
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [latestVoucher, setLatestVoucher] = useState<string | null>(null);

  // Configuration constants
  const WIN_SCORE = config.winScore || 20;
  const GRAVITY = config.gravity || 0.38;
  const JUMP_FORCE = config.jumpForce || -7.0;
  const PIPE_SPEED = config.pipeSpeed || 2.2;
  const PIPE_GAP = config.pipeGap || 180;
  const VOUCHER_TEXT = config.voucherText || 'Voucher 2 lít xăng';

  // Game internal mutable state
  const stateRef = useRef({
    birdY: 200,
    birdVelocity: 0,
    pipes: [] as Array<{ x: number; topHeight: number; passed: boolean }>,
    score: 0,
    animationFrameId: 0,
    gameActive: false,
    hasWon: false,
    shake: 0,
  });

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('vietinbank_flappy_high_score');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));
      const savedVoucher = localStorage.getItem('flappy_voucher_latest');
      if (savedVoucher) setLatestVoucher(savedVoucher);
    } catch {
      // ignore in iframe
    }
  }, []);

  const generateVoucherCode = useCallback((): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  }, []);

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEncouragement = (currentScore: number): string => {
    if (currentScore >= WIN_SCORE) return config.encouragements.win;
    if (currentScore >= 15) return config.encouragements.under20;
    if (currentScore >= 10) return config.encouragements.under15;
    if (currentScore >= 5) return config.encouragements.under10;
    return config.encouragements.under5;
  };

  const winGame = useCallback(() => {
    const s = stateRef.current;
    s.gameActive = false;
    s.hasWon = true;
    cancelAnimationFrame(s.animationFrameId);

    const newCode = generateVoucherCode();
    setVoucherCode(newCode);
    setLatestVoucher(newCode);
    setGameState('won');

    try {
      localStorage.setItem('flappy_voucher_latest', newCode);
      localStorage.setItem('vietinbank_flappy_high_score', '20');
      setHighScore(20);
    } catch {}

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#004b87', '#ed1b2f', '#fbbf24', '#10b981'],
      });
    } catch {}

    // WebApp callback
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }
  }, [WIN_SCORE, VOUCHER_TEXT, generateVoucherCode]);

  const endGame = useCallback(() => {
    const s = stateRef.current;
    s.gameActive = false;
    cancelAnimationFrame(s.animationFrameId);
    setGameState('lost');

    // Trigger mild shake
    s.shake = 10;

    if (s.score > highScore) {
      setHighScore(s.score);
      try {
        localStorage.setItem('vietinbank_flappy_high_score', s.score.toString());
      } catch {}
    }

    // WebApp callback
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: s.score,
        timestamp: new Date().toISOString(),
      });
    }
  }, [highScore]);

  const jump = useCallback(() => {
    if (!stateRef.current.gameActive) return;
    stateRef.current.birdVelocity = JUMP_FORCE;
  }, [JUMP_FORCE]);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    cancelAnimationFrame(s.animationFrameId);
    s.birdY = 220;
    s.birdVelocity = 0;
    s.pipes = [];
    s.score = 0;
    s.hasWon = false;
    s.shake = 0;
    setScore(0);
    setGameState('start');
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    cancelAnimationFrame(s.animationFrameId);
    s.birdY = 200;
    s.birdVelocity = 0;
    s.pipes = [
      { x: 450, topHeight: 140, passed: false },
      { x: 750, topHeight: 180, passed: false },
    ];
    s.score = 0;
    s.gameActive = true;
    s.hasWon = false;
    s.shake = 0;

    setScore(0);
    setGameState('playing');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastPipeX = 750;

    const loop = () => {
      if (!s.gameActive) return;

      const width = canvas.width;
      const height = canvas.height;

      // Update Bird
      s.birdVelocity += GRAVITY;
      s.birdY += s.birdVelocity;

      // Collision with ground or sky
      if (s.birdY > height - 35 || s.birdY < 10) {
        endGame();
        return;
      }

      // Update Pipes
      for (let i = 0; i < s.pipes.length; i++) {
        const pipe = s.pipes[i];
        pipe.x -= PIPE_SPEED;

        // Check if passed for score
        if (!pipe.passed && pipe.x + 60 < 100) {
          pipe.passed = true;
          s.score += 1;
          setScore(s.score);

          if (s.score >= WIN_SCORE) {
            winGame();
            return;
          }
        }

        // Collision check with bird (bird at x=100, y=birdY, radius=18)
        const birdX = 100;
        const birdRadius = 18;
        const pipeWidth = 64;

        if (
          birdX + birdRadius > pipe.x &&
          birdX - birdRadius < pipe.x + pipeWidth
        ) {
          // Inside horizontal span of pipe
          if (
            s.birdY - birdRadius < pipe.topHeight ||
            s.birdY + birdRadius > pipe.topHeight + PIPE_GAP
          ) {
            endGame();
            return;
          }
        }
      }

      // Remove off-screen pipes & spawn new ones
      s.pipes = s.pipes.filter((p) => p.x > -80);
      if (s.pipes.length > 0) {
        lastPipeX = s.pipes[s.pipes.length - 1].x;
      }
      if (lastPipeX < width - 260 && s.pipes.length < 5) {
        const minTop = 60;
        const maxTop = height - PIPE_GAP - 90;
        const randomTop = Math.floor(minTop + Math.random() * (maxTop - minTop));
        s.pipes.push({
          x: width + 20,
          topHeight: randomTop,
          passed: false,
        });
        lastPipeX = width + 20;
      }

      // RENDER
      ctx.save();
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
        s.shake *= 0.85;
        if (s.shake < 0.5) s.shake = 0;
      }

      // Background Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.7, '#bae6fd');
      skyGrad.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds & Bank Cityline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(80, 70, 35, 0, Math.PI * 2);
      ctx.arc(120, 60, 45, 0, Math.PI * 2);
      ctx.arc(160, 70, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(380, 90, 40, 0, Math.PI * 2);
      ctx.arc(430, 80, 50, 0, Math.PI * 2);
      ctx.arc(480, 90, 35, 0, Math.PI * 2);
      ctx.fill();

      // Render Pipes (VietinBank Navy / White Pillars)
      for (const pipe of s.pipes) {
        // Top Pipe
        ctx.fillStyle = '#004b87';
        ctx.fillRect(pipe.x, 0, 64, pipe.topHeight);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(pipe.x + 6, 0, 8, pipe.topHeight); // pipe highlight
        ctx.fillStyle = '#ed1b2f';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 14, 70, 14); // red lip

        // Bottom Pipe
        const bottomY = pipe.topHeight + PIPE_GAP;
        const bottomHeight = height - bottomY - 30;
        ctx.fillStyle = '#004b87';
        ctx.fillRect(pipe.x, bottomY, 64, bottomHeight);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(pipe.x + 6, bottomY, 8, bottomHeight);
        ctx.fillStyle = '#ed1b2f';
        ctx.fillRect(pipe.x - 3, bottomY, 70, 14); // red lip
      }

      // Ground
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, height - 30, width, 30);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, height - 30, width, 4);

      // Render Bird (Cute Bank Card / Flying VietinBank Token)
      ctx.save();
      ctx.translate(100, s.birdY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, s.birdVelocity * 0.08));
      ctx.rotate(angle);

      // Card body
      ctx.fillStyle = '#004b87';
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 6);
      ctx.fill();

      // Card Gold Chip
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-16, -6, 12, 12, 2);
      ctx.fill();

      // Red accent stripe
      ctx.fillStyle = '#ed1b2f';
      ctx.fillRect(-22, 6, 44, 4);

      // Little Wing
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-6, -4, 10, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      s.animationFrameId = requestAnimationFrame(loop);
    };

    s.animationFrameId = requestAnimationFrame(loop);
  }, [GRAVITY, JUMP_FORCE, PIPE_GAP, PIPE_SPEED, WIN_SCORE, endGame, winGame]);

  // Handle Resize & Canvas DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const width = Math.min(800, rect.width || 600);
      const height = 450;

      canvas.width = width;
      canvas.height = height;

      // Draw initial screen
      const ctx = canvas.getContext('2d');
      if (ctx && gameState === 'start') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#e0f2fe');
        skyGrad.addColorStop(1, '#7dd3fc');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, height - 30, width, 30);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(stateRef.current.animationFrameId);
    };
  }, [gameState]);

  // Handle Spacebar Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          jump();
        } else if (gameState === 'start') {
          startGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame]);

  return (
    <div id="flappy-voucher-game" className="space-y-4">
      {/* Top Game Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {config.title}
          </h3>
          <p className="text-xs text-slate-500">{config.shortDesc}</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Điểm cao nhất
            </span>
            <span className="text-sm font-extrabold text-[#004b87]">
              {highScore} / {WIN_SCORE}
            </span>
          </div>

          {latestVoucher && (
            <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-left">
              <span className="text-[10px] text-amber-700 font-bold block">
                Mã gần nhất
              </span>
              <span className="text-xs font-extrabold text-amber-900 tracking-wider">
                {latestVoucher}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Game Canvas Container */}
      <div
        ref={containerRef}
        onClick={() => {
          if (gameState === 'playing') jump();
        }}
        className="relative bg-sky-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md touch-none select-none flex items-center justify-center cursor-pointer min-h-[450px]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-[450px] block"
        />

        {/* HUD Overlay when Playing */}
        {gameState === 'playing' && (
          <div className="absolute top-4 inset-x-4 flex flex-col items-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md px-5 py-2 rounded-2xl text-white shadow-lg text-center flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sky-200 block">
                  Tiến độ
                </span>
                <span className="text-xl font-black text-amber-300">
                  Điểm: {score}/{WIN_SCORE}
                </span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-left">
                <span className="text-xs font-semibold text-white block">
                  {getEncouragement(score)}
                </span>
                {/* Progress bar 0 to 20 */}
                <div className="w-28 sm:w-36 h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/80 font-medium drop-shadow-md">
              Chạm màn hình hoặc nhấn Space để bay lên
            </p>
          </div>
        )}

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl space-y-4">
              <div className="w-16 h-16 mx-auto bg-sky-100 text-[#004b87] rounded-2xl flex items-center justify-center shadow-sm">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  {config.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {config.shortDesc}
                </p>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl text-xs text-[#004b87] font-semibold">
                👉 Chạm màn hình hoặc nhấn Space để bay
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Bắt đầu chơi</span>
              </button>
            </div>
          </div>
        )}

        {/* Win Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900">
                  Chúc mừng!
                </h4>
                <p className="text-sm font-semibold text-emerald-600 mt-1">
                  Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}!
                </p>
              </div>

              {/* Voucher Code Box */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-300">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Mã Voucher Nhận Quà
                </span>
                <span className="text-3xl font-black text-red-600 tracking-widest my-1 block">
                  {voucherCode}
                </span>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {config.winNote}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyVoucherCode(voucherCode);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép mã</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#004b87] hover:bg-[#003866] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lost Overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 mx-auto bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
                </h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  {config.loseMessage}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Về màn hình chính
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
