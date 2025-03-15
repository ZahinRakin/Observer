import axios from "axios";

async function getData(path, setData){
  console.log("inside fetch data method."); //control reached here.
  const response = await axios.get(path);
  console.log(response);//debugging log
  console.log(response.data); //debugging log
  console.log(typeof response.data); //debugging log
  setData(response.data);
}

export {
  getData
}