import ProfBranchForm from "./ProfBranchForm";
import ClassForm from './ClassForm';

type TableBuilderProps = {
  onCreateClick: () => void;
}

export default function TableBuilder({onCreateClick}: TableBuilderProps){

  return(
    <>
    <div className="table-builder">
      <h3>Ders Programı Hazırlama</h3>
      <div className='teacher-branch-selector'>
        <ProfBranchForm />
      </div>
      <div className='class-selector'>
        <ClassForm />
      </div>
    </div>

    <button onClick={onCreateClick}> Program Oluştur</button>
    </>
  )
}