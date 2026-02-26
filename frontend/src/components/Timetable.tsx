import { timetable } from "../tempdata/timetable";
import {ArrowLeftFromLine} from 'lucide-react';

const HOUR_COUNT = 8;

type TimeTableProps = {
  onGoBackClick: () => void;
}

export default function Timetable({onGoBackClick}: TimeTableProps){

  return(
    <>
    <div className='table-header'>
      <ArrowLeftFromLine className="icon" onClick={onGoBackClick}/>
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
          {Array.from({length: HOUR_COUNT }).map((_,hourIndex) => {
            return(
            <tr key={hourIndex + 1}>
              <th>{hourIndex +1}</th>
              {timetable.map((day, dayIndex) => {
                return(
                  <td key={dayIndex + 1}>
                  <div className='tableProf'>{day[hourIndex].class}</div>
                  <div>({day[hourIndex].teacher})</div>
                </td>
              )})}
            </tr>
          )})}
        </tbody>
      </table>
    </div>
    </>
  )
}

// might need to go over how the day/hour indexing works