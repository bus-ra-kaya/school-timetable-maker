import { useEffect, useRef, useState, useId } from "react";
import s from '../style/Tooltip.module.css';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({text, children}: TooltipProps){

  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // handling clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)){
          setOpen(false);
      }
    };
   
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Escape') setOpen(false);
    }
    if(open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  const isVisible = open || isHovered;
  const tooltipId = useId();

  return (
    <span className={s.infoWrapper} ref={tooltipRef}>
      <div
      aria-label='Daha fazla bilgi'
      onClick={() => {
        if (isHovered) {
          setOpen(false);
        } else {
          setOpen(prev => !prev);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={s.trigger}>
        {children}
      </div>
      <span
        role='tooltip'
        id={tooltipId}
        aria-hidden={!isVisible}
        className={`${s.tooltip} ${isVisible ? s.visible : s.hidden}`}
      >
        {text}
      </span>
    </span>
  )
}
