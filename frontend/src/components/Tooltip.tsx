import { useEffect, useRef, useState } from "react";
import s from '../style/Tooltip.module.css';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({text, children}: TooltipProps){

  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)){
          setOpen(false);
      }
    };
    if(open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);

  }, [open]);

  const isVisible = open || isHovered;

  return (
    <span className={s.infoWrapper} ref={tooltipRef}>
      <button 
      onClick={() => {
        if (isHovered) {
          setOpen(false);
        } else {
          setOpen(prev => !prev);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      type='button'
      className={s.trigger}>
        {children}
      </button>
      {isVisible && <span className={s.tooltip}>{text}</span> }
    </span>
  )
}