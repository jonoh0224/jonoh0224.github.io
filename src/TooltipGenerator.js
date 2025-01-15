import React, { useState } from 'react';
import { Copy } from 'lucide-react';

function TooltipGenerator() {
  const [backgroundColor, setBackgroundColor] = useState('#fdffe2');
  const [textColor, setTextColor] = useState('#000000');
  const [shadowEnabled, setShadowEnabled] = useState(true);
  const [triangleEnabled, setTriangleEnabled] = useState(true);
  const [tooltipText, setTooltipText] = useState('This is a tooltip message!');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [trianglePosition, setTrianglePosition] = useState('top');
  const [triangleSize, setTriangleSize] = useState(8);
  const [paddingX, setPaddingX] = useState(12);
  const [paddingY, setPaddingY] = useState(8);
  const [borderRadius, setBorderRadius] = useState(6);

  const generateTooltipStyles = () => {
    const shadowStyle = shadowEnabled ? '\n  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));' : '';
    
    let triangleStyle = '';
    switch(trianglePosition) {
      case 'top':
        triangleStyle = `
  border-left: ${triangleSize}px solid transparent;
  border-right: ${triangleSize}px solid transparent;
  border-bottom: ${triangleSize}px solid ${backgroundColor};
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);`;
        break;
      case 'bottom':
        triangleStyle = `
  border-left: ${triangleSize}px solid transparent;
  border-right: ${triangleSize}px solid transparent;
  border-top: ${triangleSize}px solid ${backgroundColor};
  top: 100%;
  left: 50%;
  transform: translateX(-50%);`;
        break;
      case 'left':
        triangleStyle = `
  border-top: ${triangleSize}px solid transparent;
  border-bottom: ${triangleSize}px solid transparent;
  border-right: ${triangleSize}px solid ${backgroundColor};
  right: 100%;
  top: 50%;
  transform: translateY(-50%);`;
        break;
      case 'right':
        triangleStyle = `
  border-top: ${triangleSize}px solid transparent;
  border-bottom: ${triangleSize}px solid transparent;
  border-left: ${triangleSize}px solid ${backgroundColor};
  left: 100%;
  top: 50%;
  transform: translateY(-50%);`;
        break;
    }

    return `.tooltip {
  position: relative;
  display: inline-block;
  background-color: ${backgroundColor};
  color: ${textColor};
  padding: ${paddingY}px ${paddingX}px;
  border-radius: ${borderRadius}px;${shadowStyle}
}

.tooltip .tooltip-triangle {
  position: absolute;
  width: 0;
  height: 0;${triangleStyle}
}`;
  };

  const generateTooltipHTML = () => {
    return `<div class="tooltip">${triangleEnabled ? '\n  <div class="tooltip-triangle"></div>' : ''}
  ${tooltipText}
</div>`;
  };
  
  const handleCopyHTML = () => {
    navigator.clipboard.writeText(generateTooltipHTML());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(generateTooltipStyles());
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };
  
  const previewTooltip = () => {
    const triangleStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
      ...(trianglePosition === 'top' && {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${triangleSize}px solid transparent`,
        borderRight: `${triangleSize}px solid transparent`,
        borderBottom: `${triangleSize}px solid ${backgroundColor}`
      }),
      ...(trianglePosition === 'bottom' && {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${triangleSize}px solid transparent`,
        borderRight: `${triangleSize}px solid transparent`,
        borderTop: `${triangleSize}px solid ${backgroundColor}`
      }),
      ...(trianglePosition === 'left' && {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${triangleSize}px solid transparent`,
        borderBottom: `${triangleSize}px solid transparent`,
        borderRight: `${triangleSize}px solid ${backgroundColor}`
      }),
      ...(trianglePosition === 'right' && {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${triangleSize}px solid transparent`,
        borderBottom: `${triangleSize}px solid transparent`,
        borderLeft: `${triangleSize}px solid ${backgroundColor}`
      })
    };

    return (
      <div className="flex items-center justify-center w-full h-40">
        <div
          className={`relative inline-block ${shadowEnabled ? 'drop-shadow-md' : ''}`}
          style={{
            backgroundColor,
            color: textColor,
            padding: `${paddingY}px ${paddingX}px`,
            borderRadius: `${borderRadius}px`
          }}
        >
          {triangleEnabled && (
            <div style={triangleStyles} />
          )}
          {tooltipText}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Tooltip Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10 w-20"
              />
              <input 
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-20"
              />
              <input 
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Triangle Position</label>
            <select
              value={trianglePosition}
              onChange={(e) => setTrianglePosition(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Triangle Size (px)</label>
            <input
              type="number"
              value={triangleSize}
              onChange={(e) => setTriangleSize(Number(e.target.value))}
              min="4"
              max="20"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Padding X (px)</label>
            <input
              type="number"
              value={paddingX}
              onChange={(e) => setPaddingX(Number(e.target.value))}
              min="4"
              max="40"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Padding Y (px)</label>
            <input
              type="number"
              value={paddingY}
              onChange={(e) => setPaddingY(Number(e.target.value))}
              min="4"
              max="40"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
            <input
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              min="0"
              max="20"
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tooltip Text</label>
            <input
              type="text"
              value={tooltipText}
              onChange={(e) => setTooltipText(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="shadowEnabled"
                checked={shadowEnabled}
                onChange={() => setShadowEnabled(!shadowEnabled)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="shadowEnabled" className="text-sm font-medium text-gray-700">Shadow</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="triangleEnabled"
                checked={triangleEnabled}
                onChange={() => setTriangleEnabled(!triangleEnabled)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="triangleEnabled" className="text-sm font-medium text-gray-700">Triangle</label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Tooltip Preview</h2>
        <div className="text-center p-4">
          {previewTooltip()}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm w-1/2">
          <h2 className="text-lg font-semibold mb-3">HTML Code</h2>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap">
              {generateTooltipHTML()}
            </pre>
            <button
              onClick={handleCopyHTML}
              className="absolute top-2 right-2 text-gray-500 hover:text-blue-500 focus:outline-none"
            >
              {copiedHtml ? 'Copied!' : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm w-1/2">
          <h2 className="text-lg font-semibold mb-3">CSS Code</h2>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap">
              {generateTooltipStyles()}
            </pre>
            <button
              onClick={handleCopyCSS}
              className="absolute top-2 right-2 text-gray-500 hover:text-blue-500 focus:outline-none"
            >
              {copiedCss ? 'Copied!' : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TooltipGenerator;
