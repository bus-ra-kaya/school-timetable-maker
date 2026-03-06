import { useEffect, useRef, useState } from "react";

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
    <span className="infoWrapper" ref={tooltipRef}>
      <span 
      onClick={() => setOpen(prev => !prev)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
        {children}
      </span>
      {isVisible && <span className="tooltip">{text}</span> }
    </span>
  )
}