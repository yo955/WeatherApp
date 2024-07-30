import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
// Mui Components
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CloudIcon from "@mui/icons-material/Cloud"
import  Button  from '@mui/material/Button';

// External libraries
import axios from 'axios';
import moment from 'moment';
import "moment/min/locales";
import { useTranslation } from 'react-i18next';


const theme = createTheme({
  typography: {
   fontFamily:["arb"]
  },
});

function App() {
  // variable
  let cancelAxios = null

const { t, i18n } = useTranslation();
const [dateAndtime,setDateAndtime] = useState("")
const [temp,setTemp] = useState({
  number:null,
  description:"",
  min:null,
  max:null,
  icon:null
});
const [locale,setLocale] = useState("ar");


function handleLanguageClick(){
  if(locale == "en"){
    setLocale("ar")
    i18n.changeLanguage("ar");
    moment.locale("ar");
  }else{
    setLocale("en")
    i18n.changeLanguage("en");
    moment.locale("en");
  }
   // moment library
   setDateAndtime( moment().format('MMMM Do YYYY, h:mm:ss a'))
}

  useEffect(()=>{

  // Make a request for a user with a given ID
  axios.get('https://api.openweathermap.org/data/2.5/weather?lat=24.7&lon=46.5&appid=290aa30729a35cdfd8089925d49911da',{
    cancelToken:new axios.CancelToken((c)=>{
      cancelAxios = c;
    }),
  }
)
  .then(function (response) {
    // handle success
   const responseTemp = Math.round(response.data.main.temp -272.15)
   const min =  Math.round(response.data.main.temp_min -272.15)
   const max =  Math.round(response.data.main.temp_max -272.15)
   const description = response.data.weather[0].description;
   const responseIcon = response.data.weather[0].icon;

   setTemp({
    number:responseTemp,
    min:min,
    max:max,
    description:description,
    icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
  });
  })
  .catch(function (error) {
    // handle error
    console.log(error);

  })
  return ()=>{
    cancelAxios();
  }
 
},[])

  return (
    <div className='App'>
      <ThemeProvider theme={theme} >
       <Container maxWidth="sm">
        <div 
        style={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column"
        }}>
          {/* Card */}
          <Card variant="contained" 
          style={{
          background:"rgb(28 52 91 / 36%)",
          color:"#fff",
          padding:"10px",
          borderRadius:"15px",
          boxShadow:"0px 11px 1px rgba(0,0,0,0,05)",
          width:"100%"
          }} 
          dir={locale == "ar"?"rtl":"ltr"}
          >
          <div className='flex'>
            <Typography variant="h1" style={{marginRight:"20px"}}> 
              {t("Riyadh" )}
            </Typography>
            
            <Typography variant="h5" style={{marginRight:"20px"}}>
               {dateAndtime} {locale == "ar"?"الاثنين":"Monday"}
            </Typography>
          </div>
            <hr/>
          
          <div style={{display:"flex",justifyContent:"space-around",
          }}>
            <div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Typography variant="h1" style={{textAlign:"right"}} >
                    {temp.number}
                  </Typography>

                    <img src={temp.icon}/>

                    </div>

                  <Typography variant="h6" >
                     {t(temp.description)}
                  </Typography>
                

           {/* Min & Max */}
           
           <div style={{display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
           }}>
            <h5> {t("min")} :{temp.min}</h5>
            <h5 style={{margin:"0 5px"}}>|</h5>
            <h5>{t("max")} :{temp.max}</h5>
          </div>
          </div>
        
          <div>
          <CloudIcon style={{fontSize:"200px"}}/>
          </div>
        </div>
          </Card>
        {/* Card */}
        {/* Button */}
        <div dir={locale == "ar"?"rtl":"ltr"}
         style={{
          display:"flex",
          justifyContent:"end",
          width:"100%",
          marginTop:"20px"
        }}>
        <Button style={{color:"white"}} variant='text' onClick={handleLanguageClick}>
          {locale =="en" ?"Arabic" :"انجليزى"}
        </Button>
        </div>
        {/* Button */}
       </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
