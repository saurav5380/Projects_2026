
export const getRequest = (token:string, URL: string) => {
    fetch(URL,{
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    }).then(response => {
        if (!response.ok){
            throw new Error (`HTTP Error! status: ${response.status}`)
        }
        return response.json()
    })
    .catch((error: unknown)=>{
        if (error instanceof Error){
            console.error("Fetch error:", error.message)
        }
        else{
            console.error("Error occurred: ", error)
        }
    }

    )
};

export const postRequest = <T,>(token:string, URL: string, data:T) => {
    fetch(URL,{
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok){
            throw new Error (`HTTP Error! status: ${response.status}`)
        }
        return response.json()
    })
    .catch((error: unknown)=>{
        if (error instanceof Error){
            console.error("Fetch error:", error.message)
        }
        else{
            console.error("Error occurred: ", error)
        }
    })
};

export const patchRequest = <T,>(token:string, URL:string, data:T) =>{
    fetch(URL, {
        method: "PATCH",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
    }).then(response =>{
        if(!response.ok){
            throw new Error (`HTTP Error! status: ${response.status}`);
        }
        return response.json()
    })
    .catch((error:unknown) => {
        if (error instanceof Error){
            console.error("Fetch error:",error.message)
        }
        else{
            console.error("Error occurred:", error)
        }
    })
};

export const deleteRequest = (token:string, URL:string, id:number) =>{
    fetch(URL, {
        method: "DELETE",
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(id)
    }).then(response =>{
        if(!response.ok){
            throw new Error (`HTTP Error! status: ${response.status}`);
        }
        return response.json()
    })
    .catch((error:unknown) => {
        if (error instanceof Error){
            console.error("Fetch error:",error.message)
        }
        else{
            console.error("Error occurred:", error)
        }
    })
}

