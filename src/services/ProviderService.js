import axios from 'axios'
// import source from '@/store/modules/endpoint'
// import { useAuthen } from '@/stores/authen'

import { useAuthen } from "@/stores/authen.js"

const instanceApi = (authentication = true) =>{


    const store = useAuthen();

    // console.log("API URL : ", process.env.VUE_APP_API);
    
    const http = axios.create({ baseURL: process.env.VUE_APP_API });
    http.defaults.headers.common['Content-Type'] = 'application/json';
    if(authentication){
        http.defaults.headers.common['Authorization'] = "Bearer " + localStorage._token;
       
    }

    http.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        },
        error => {
            // console.log("Error In Interceptor")
            // console.log(error);
            // if (!error.response) {
            //     console.log("network error")
            // }
            // else {
            //     if (error.response.status) {
            //         switch (error.response.status) {
            //             case 401:
            //                 //alert("session expired");
            //                // console.log("session expire")
            //                 //store.directLogout()
                            
            //                 break;
            //             default:
            //                 return Promise.reject(error);
            //         }
            //     }
            // }
        }
    )

    return http;
}



export default {
    instanceApi
}

export {
    instanceApi
}
