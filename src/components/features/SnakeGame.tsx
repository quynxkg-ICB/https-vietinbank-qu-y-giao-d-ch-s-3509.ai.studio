import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Gift,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { SnakeConfig } from '../../types';

interface SnakeGameProps {
  config: SnakeConfig;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
  const [score, setScore] = useState<number>(0);
  const [currentRewardLevel, setCurrentRewardLevel] = useState<string>('Chưa có');
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [finalCertificate, setFinalCertificate] = useState<{
    score: number;
    reward: string;
    completedAt: string;
  } | null>(null);

  // Grid dimensions
  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;

  // Mutable Game Loop State
  const gameRef = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ] as Point[],
    direction: 'UP' as Direction,
    nextDirection: 'UP' as Direction,
    food: { x: 5, y: 5 } as Point,
    score: 0,
    intervalId: null as any,
    reached20: false,
    reached40: false,
  });

  const spawnFood = (snake: Point[]): Point => {
    let newFood: Point;
    let collision = true;
    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
      };
      collision = snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      if (!collision) return newFood;
    }
    return { x: 5, y: 5 };
  };

  const showMilestoneToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  const handleGameOver = useCallback(() => {
    const g = gameRef.current;
    if (g.intervalId) clearInterval(g.intervalId);

    let rewardText = 'Chưa đạt mốc nhận thưởng';
    if (g.score >= 40) {
      rewardText = '02 Voucher xăng 2 lít (Tổng 4 lít)';
    } else if (g.score >= 20) {
      rewardText = '01 Voucher xăng 2 lít';
    }

    const nowStr = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    setFinalCertificate({
      score: g.score,
      reward: rewardText,
      completedAt: nowStr,
    });

    setGameState('ended');
  }, []);

  const changeDirection = (dir: Direction) => {
    const cur = gameRef.current.direction;
    if (
      (dir === 'UP' && cur !== 'DOWN') ||
      (dir === 'DOWN' && cur !== 'UP') ||
      (dir === 'LEFT' && cur !== 'RIGHT') ||
      (dir === 'RIGHT' && cur !== 'LEFT')
    ) {
      gameRef.current.nextDirection = dir;
    }
  };

  const startGame = () => {
    const g = gameRef.current;
    if (g.intervalId) clearInterval(g.intervalId);

    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];

    g.snake = initialSnake;
    g.direction = 'UP';
    g.nextDirection = 'UP';
    g.food = spawnFood(initialSnake);
    g.score = 0;
    g.reached20 = false;
    g.reached40 = false;

    setScore(0);
    setCurrentRewardLevel('Chưa có');
    setActiveToast(null);
    setFinalCertificate(null);
    setGameState('playing');

    // Run game tick every 130ms (comfortable speed for banking clients)
    g.intervalId = setInterval(gameTick, 130);
  };

  const gameTick = () => {
    const g = gameRef.current;
    g.direction = g.nextDirection;

    const head = { ...g.snake[0] };
    if (g.direction === 'UP') head.y -= 1;
    if (g.direction === 'DOWN') head.y += 1;
    if (g.direction === 'LEFT') head.x -= 1;
    if (g.direction === 'RIGHT') head.x += 1;

    // Wall collision
    const maxCols = CANVAS_WIDTH / GRID_SIZE;
    const maxRows = CANVAS_HEIGHT / GRID_SIZE;
    if (head.x < 0 || head.x >= maxCols || head.y < 0 || head.y >= maxRows) {
      handleGameOver();
      return;
    }

    // Self collision
    if (g.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      handleGameOver();
      return;
    }

    // Move snake
    const newSnake = [head, ...g.snake];

    // Check food eaten
    if (head.x === g.food.x && head.y === g.food.y) {
      g.score += 1;
      setScore(g.score);
      g.food = spawnFood(newSnake);

      // Check Reward Milestones
      if (g.score >= 40 && !g.reached40) {
        g.reached40 = true;
        setCurrentRewardLevel('02 Voucher 2L');
        showMilestoneToast(config.thresholds[1]?.message || 'Xuất sắc! Đạt 40 điểm nhận 02 voucher xăng!');
      } else if (g.score >= 20 && !g.reached20) {
        g.reached20 = true;
        setCurrentRewardLevel('01 Voucher 2L');
        showMilestoneToast(config.thresholds[0]?.message || 'Chúc mừng! Đạt 20 điểm nhận 01 voucher xăng!');
      }
    } else {
      newSnake.pop();
    }

    g.snake = newSnake;
    drawCanvas();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = gameRef.current;

    // Clear background
    ctx.fillStyle = '#0f172a'; // modern dark slate
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle Grid pattern
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Food (Gold Coin / Voucher Box)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(
      g.food.x * GRID_SIZE + GRID_SIZE / 2,
      g.food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Food inner accent
    ctx.fillStyle = '#ed1b2f';
    ctx.beginPath();
    ctx.arc(
      g.food.x * GRID_SIZE + GRID_SIZE / 2,
      g.food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake Body & Head
    g.snake.forEach((seg, index) => {
      if (index === 0) {
        // Head (VietinBank Red & Blue)
        ctx.fillStyle = '#ed1b2f';
        ctx.beginPath();
        ctx.roundRect(
          seg.x * GRID_SIZE + 1,
          seg.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
          5
        );
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(
          seg.x * GRID_SIZE + 6,
          seg.y * GRID_SIZE + 6,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.arc(
          seg.x * GRID_SIZE + 14,
          seg.y * GRID_SIZE + 6,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        // Body (VietinBank Blue)
        ctx.fillStyle = index % 2 === 0 ? '#004b87' : '#0284c7';
        ctx.beginPath();
        ctx.roundRect(
          seg.x * GRID_SIZE + 1,
          seg.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
          4
        );
        ctx.fill();
      }
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial draw
  useEffect(() => {
    drawCanvas();
    return () => {
      if (gameRef.current.intervalId) clearInterval(gameRef.current.intervalId);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#004b87]" />
            {config.title}
          </h3>
          <p className="text-xs text-slate-500">{config.subTitle}</p>
        </div>

        {/* Current status display */}
        <div className="flex items-center space-x-3">
          <div className="text-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Điểm hiện tại
            </span>
            <span className="text-base font-black text-red-600">
              {score}
            </span>
          </div>

          <div className="text-center bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
            <span className="text-[10px] uppercase font-bold text-[#004b87] block">
              Mốc thưởng
            </span>
            <span className="text-xs font-bold text-[#004b87]">
              {score >= 40
                ? '02 Voucher 2L'
                : score >= 20
                ? '01 Voucher 2L'
                : 'Cần 20đ'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Canvas & On-screen Controller */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Canvas Area */}
        <div className="md:col-span-8 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 bg-slate-900">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="block max-w-full aspect-square"
            />

            {/* Non-intrusive Milestone Toast (Requirement: không làm gián đoạn game) */}
            {activeToast && (
              <div className="absolute top-4 inset-x-4 z-20 animate-in slide-in-from-top duration-300">
                <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold text-center justify-center">
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <span>{activeToast}</span>
                </div>
              </div>
            )}

            {/* Start Overlay */}
            {gameState === 'start' && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="text-center text-white space-y-4 max-w-xs">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#004b87] to-sky-500 flex items-center justify-center">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Rắn Săn Mồi VietinBank</h4>
                    <p className="text-xs text-sky-200 mt-1">
                      Ăn vàng để tăng điểm và nhận quà tặng xăng 2 lít!
                    </p>
                  </div>
                  <button
                    onClick={startGame}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 font-bold text-sm shadow-md hover:brightness-110 active:scale-95"
                  >
                    Bắt đầu chơi
                  </button>
                </div>
              </div>
            )}

            {/* Game Over & Phiếu Xác Nhận Quà Tặng (Exact Requirement from PDF 6) */}
            {gameState === 'ended' && finalCertificate && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 z-30">
                <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm text-center shadow-2xl space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-[#004b87] uppercase tracking-wider">
                      VietinBank Kiên Giang
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-500">
                      Phiếu quà tặng
                    </span>
                  </div>

                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Phiếu Xác Nhận Quà Tặng
                    </h4>
                    <p className="text-xs text-slate-500">
                      Thời gian: {finalCertificate.completedAt}
                    </p>
                  </div>

                  {/* Certificate details */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Điểm cuối cùng:</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {finalCertificate.score} điểm
                      </span>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Mức quà đạt được:</span>
                      <span
                        className={`font-bold ${
                          finalCertificate.score >= 20
                            ? 'text-red-600 font-extrabold'
                            : 'text-slate-600'
                        }`}
                      >
                        {finalCertificate.reward}
                      </span>
                    </div>
                  </div>

                  {/* Confirmation note for tellers */}
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium leading-relaxed text-left">
                    👉 {config.confirmNote}
                  </div>

                  <button
                    onClick={startGame}
                    className="w-full py-2.5 rounded-xl bg-[#004b87] hover:bg-[#003866] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Chơi lại</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* On-screen Direction Keypad for Touch Kiosk */}
          <div className="mt-4 flex flex-col items-center space-y-1 select-none">
            <button
              onClick={() => changeDirection('UP')}
              className="w-12 h-12 rounded-xl bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs"
              title="Lên"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => changeDirection('LEFT')}
                className="w-12 h-12 rounded-xl bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs"
                title="Trái"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => changeDirection('DOWN')}
                className="w-12 h-12 rounded-xl bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs"
                title="Xuống"
              >
                <ArrowDown className="w-6 h-6" />
              </button>
              <button
                onClick={() => changeDirection('RIGHT')}
                className="w-12 h-12 rounded-xl bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 shadow-xs"
                title="Phải"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              Dùng phím mũi tên hoặc nút ảo trên màn hình
            </span>
          </div>
        </div>

        {/* Instructions & Reward Tiers Sidecard */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Gift className="w-5 h-5 text-red-600" />
            Cơ chế nhận thưởng
          </h4>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#004b87]">
                  Mốc 20 Điểm
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#004b87] text-white">
                  01 Voucher
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Nhận ngay 01 voucher xăng trị giá 2 lít.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  Mốc 40 Điểm (Đặc biệt)
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white">
                  02 Voucher
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Nhận ngay 02 voucher xăng (tổng 4 lít xăng).
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <p className="font-bold text-slate-700">Hướng dẫn nhanh:</p>
            <p>• Dùng phím mũi tên bàn phím hoặc nút ảo cảm ứng.</p>
            <p>• Ăn vàng để cộng điểm, tránh va vào tường hoặc thân rắn.</p>
            <p>• Không yêu cầu thông tin cá nhân. Nhận quà trực tiếp tại quầy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
