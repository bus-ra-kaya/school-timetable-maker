const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const NODE_MODE = import.meta.env.NODE_ENV;

type ReturnValue = {
  data: number | null;
  error: string | null;
}

export const fetchSettings = async (): Promise<ReturnValue> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings`);

    if(!response.ok){
      if(NODE_MODE === 'development'){
        try {
          const body = await response.json();
          console.log(body.error);
        } catch (err){
          console.log(err);
        }
      } 
      return {data: null, error: 'Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz.'};
    }

    const body = await response.json();
    return {data: body.data, error: null};


  } catch (err) {
    if( NODE_MODE === 'development'){
      console.log(err);
    }
    return {data: null, error: 'Ayarlar bulunamadı. Lütfen daha sonra tekrar deneyiniz.'};
  }
}