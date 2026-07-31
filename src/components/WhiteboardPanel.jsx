import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { socket } from '../socket';
import { useRoom } from '../context/RoomContext';
import {
PenTool,
Eraser,
Type,
Square,
Circle,
Undo2,
Redo2,
Trash2,
} from 'lucide-react';

export default function WhiteboardPanel() {
const canvasRef = useRef(null);
const fabricCanvas = useRef(null);

const { roomId, userName } = useRoom();
const [mode, setMode] = useState('pen');

const history = useRef([]);
const redoStack = useRef([]);

useEffect(() => {
const canvas = new fabric.Canvas(canvasRef.current, {
width: 900,
height: 450,
backgroundColor: '#ffffff',
selection: true,
});


canvas.isDrawingMode = true;
canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
canvas.freeDrawingBrush.width = 3;
canvas.freeDrawingBrush.color = '#2563eb';

fabricCanvas.current = canvas;

socket.emit('join-room', {
  roomId,
  name: userName,
});

let isRemoteUpdate = false;

const saveState = () => {
  history.current.push(JSON.stringify(canvas.toJSON()));
  if (history.current.length > 50) history.current.shift();
  redoStack.current = [];
};

const syncCanvas = () => {
  if (isRemoteUpdate) return;

  socket.emit('canvas-update', {
    roomId,
    canvas: canvas.toJSON(),
  });

  saveState();
};

canvas.on('path:created', syncCanvas);
canvas.on('object:added', syncCanvas);
canvas.on('object:modified', syncCanvas);
canvas.on('object:removed', syncCanvas);

socket.on('canvas-update', (canvasData) => {
  isRemoteUpdate = true;

  canvas.loadFromJSON(canvasData, () => {
    canvas.renderAll();
    isRemoteUpdate = false;
  });
});

saveState();

return () => {
  socket.off('canvas-update');
  canvas.dispose();
};


}, [roomId, userName]);

const enablePen = () => {
const canvas = fabricCanvas.current;
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 3;
canvas.freeDrawingBrush.color = '#2563eb';
setMode('pen');
};

const enableEraser = () => {
const canvas = fabricCanvas.current;
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 20;
canvas.freeDrawingBrush.color = '#ffffff';
setMode('eraser');
};

const addText = () => {
const canvas = fabricCanvas.current;
canvas.isDrawingMode = false;


const text = new fabric.IText('Double click to edit', {
  left: 120,
  top: 120,
  fontSize: 24,
  fill: '#111827',
});

canvas.add(text);
canvas.setActiveObject(text);
canvas.renderAll();
setMode('text');


};

const addRectangle = () => {
const canvas = fabricCanvas.current;
canvas.isDrawingMode = false;


const rect = new fabric.Rect({
  left: 180,
  top: 150,
  width: 150,
  height: 100,
  fill: 'transparent',
  stroke: '#2563eb',
  strokeWidth: 3,
  rx: 8,
  ry: 8,
});

canvas.add(rect);
canvas.renderAll();
setMode('rect');


};

const addCircle = () => {
const canvas = fabricCanvas.current;
canvas.isDrawingMode = false;


const circle = new fabric.Circle({
  left: 280,
  top: 180,
  radius: 50,
  fill: 'transparent',
  stroke: '#10b981',
  strokeWidth: 3,
});

canvas.add(circle);
canvas.renderAll();
setMode('circle');


};

const undo = () => {
const canvas = fabricCanvas.current;
if (history.current.length <= 1) return;


const current = history.current.pop();
redoStack.current.push(current);

const previous = history.current[history.current.length - 1];

canvas.loadFromJSON(JSON.parse(previous), () => {
  canvas.renderAll();
});


};

const redo = () => {
const canvas = fabricCanvas.current;
if (redoStack.current.length === 0) return;


const state = redoStack.current.pop();
history.current.push(state);

canvas.loadFromJSON(JSON.parse(state), () => {
  canvas.renderAll();
});


};

const clearCanvas = () => {
const canvas = fabricCanvas.current;


canvas.clear();
canvas.backgroundColor = '#ffffff';
canvas.renderAll();

socket.emit('canvas-update', {
  roomId,
  canvas: canvas.toJSON(),
});

history.current = [];
redoStack.current = [];

enablePen();


};

return ( <div className='flex-1 bg-[#0F172A] border border-[#1E293B] rounded-3xl p-5'> <div className='flex items-center justify-between mb-5'> <div> <h2 className='text-xl font-semibold text-white'>Shared Whiteboard</h2> <p className='text-sm text-gray-400'>Room: {roomId}</p> </div>


    <div className='flex items-center gap-2'>
      <button
        onClick={enablePen}
        className={`p-2 rounded-xl ${mode === 'pen' ? 'bg-indigo-600' : 'bg-[#1E293B]'}`}
      >
        <PenTool size={18} />
      </button>

      <button
        onClick={enableEraser}
        className={`p-2 rounded-xl ${mode === 'eraser' ? 'bg-indigo-600' : 'bg-[#1E293B]'}`}
      >
        <Eraser size={18} />
      </button>

      <button
        onClick={addText}
        className={`p-2 rounded-xl ${mode === 'text' ? 'bg-indigo-600' : 'bg-[#1E293B]'}`}
      >
        <Type size={18} />
      </button>

      <button
        onClick={addRectangle}
        className={`p-2 rounded-xl ${mode === 'rect' ? 'bg-indigo-600' : 'bg-[#1E293B]'}`}
      >
        <Square size={18} />
      </button>

      <button
        onClick={addCircle}
        className={`p-2 rounded-xl ${mode === 'circle' ? 'bg-indigo-600' : 'bg-[#1E293B]'}`}
      >
        <Circle size={18} />
      </button>

      <button
        onClick={undo}
        className='p-2 rounded-xl bg-[#1E293B] hover:bg-indigo-600 transition'
      >
        <Undo2 size={18} />
      </button>

      <button
        onClick={redo}
        className='p-2 rounded-xl bg-[#1E293B] hover:bg-indigo-600 transition'
      >
        <Redo2 size={18} />
      </button>

      <button
        onClick={clearCanvas}
        className='p-2 rounded-xl bg-red-600 hover:bg-red-500 transition'
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>

  <div className='bg-white rounded-3xl p-3 overflow-auto'>
    <canvas
      ref={canvasRef}
      className='rounded-2xl border border-gray-200'
    />
  </div>
</div>


);
}
