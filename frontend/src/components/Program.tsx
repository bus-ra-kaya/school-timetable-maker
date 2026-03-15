import {ArrowLeftFromLine} from 'lucide-react';
import type { lessonSlot } from '../types';
import { useNavigate } from 'react-router-dom';
const HOUR_COUNT = 8;
const DAYS_COUNT = 5;

type ProgramProps = {
  program: lessonSlot[];
}

export default function Program({program}: ProgramProps){

  const navigate = useNavigate();

  return(
    <>
    <div className='table-header'>
      <ArrowLeftFromLine className="icon" onClick={() => navigate('/create-program')}/>
    </div>
      <div>
      <table>
        <thead>
          <tr>
            <th>Saat</th>
            <th>Pazartesi</th>
            <th>Salı</th>
            <th>Çarşamba</th>
            <th>Perşembe</th>
            <th>Cuma</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({length: HOUR_COUNT}).map((_, hourIndex) => (
            <tr key={hourIndex}>
              <th>{hourIndex +1}</th>
              {Array.from({length: DAYS_COUNT }).map((_, dayIndex) => {

                const lessonIndex = (dayIndex * HOUR_COUNT) + hourIndex;
                const lesson = program[lessonIndex];

                return (
                  <td key={dayIndex}>
                    {lesson ? (
                      <>
                      <div className="tableProf">{lesson.name}</div>
                      <div>{lesson.branch}</div>
                      </>
                    ) : null}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

// might need to go over how the day/hour indexing works