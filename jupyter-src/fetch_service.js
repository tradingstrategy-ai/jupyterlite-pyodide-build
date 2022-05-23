if (!self.document) {
    // this code is run when this script is a service worker

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var next_id=1;

    var fetches={}
    
    async function fetch_header_id(request)
    {
        var this_id=next_id;
        var args_text=await request.text()
        var args_json=JSON.parse(args_text);
        next_id+=1;
        let fetch_args={method:args_json.method,headers:args_json.req_headers};
        if (args_json.req_data.length>0)
        {
            fetch_args.body=args_json.req_data;
        }
        try
        {    
            var response=await fetch(args_json.url,fetch_args);
            var obj= Object.fromEntries(response.headers.entries());
            obj["requests-fetch-id"]=this_id;
            obj["requests-fetch-status"]=response.status;
            obj["requests-fetch-status-text"]=response.statusText;
            var jsonHeaders=JSON.stringify(obj);
            fetches[this_id]=response.body.getReader();
            return new Response(jsonHeaders,
                {status: 200,
                        statusText: "Proxy OK"});
        }
        catch(e)
        {
            var obj= Object();
            obj["requests-fetch-id"]=this_id;
            obj["requests-fetch-status"]=403;
            obj["requests-fetch-status-text"]="Failed to read headers, probably a CORS error";
            obj["requests-fetch-id"]=-1;
            var jsonHeaders=JSON.stringify(obj);
            return new Response(jsonHeaders,
                {status: 200,
                        statusText: "Proxy OK"});
        }
    }

    async function fetch_next_block(fetch_id)
    {
        var data=await fetches[fetch_id].read();
        if(data.done)
        {
            delete fetches[fetch_id]
        }
        return new Response(data.value,
            {status: 200,
                    statusText: "OK"});
    }

    function doFetch(evt)
    {
        let url=new URL(evt.request.url)
        if(url.pathname.endsWith("/fetch_service/fetch_headers"))
        {
            evt.respondWith(fetch_header_id(evt.request));
        }
        else if(url.pathname.endsWith("/fetch_service/fetch_block"))
        {
            let fetchID=parseInt(url.search.substr(1));
            if(fetchID in fetches)
            {
                evt.respondWith(fetch_next_block(fetchID));
            }
        }
    }

    function doInstall(evt)
    {
        self.skipWaiting();
    }

    function doMessage(evt)
    {
        if (evt.data === "claimMe") {
            self.clients.claim();
            console.log("Claiming service clients");
        }
    }


    self.addEventListener("fetch", doFetch);
    self.addEventListener("install", doInstall);
    self.addEventListener("message",doMessage);

}else
{


    async function check_install(url)
    {
        if (navigator.serviceWorker) 
        {
            let registration=await navigator.serviceWorker.getRegistration();
            if(!registration)
            {
                console.log("Register new service");
                registration=await navigator.serviceWorker.register(url);
                console.log("service controller",navigator.serviceWorker.controller);
            }else
            {
                console.log("Got registered service");
                console.log("controller",navigator.serviceWorker.controller);
            }

            if (navigator.serviceWorker.controller === null) {
            // we get here after a ctrl+f5 OR if there was no previous service worker.
                console.log("service is not controller of page - do claim")
                await navigator.serviceWorker.ready;
                registration.active.postMessage("claimMe");
            }
        }
    }

    console.log("Try register service")
    let url=document.currentScript.src;
    check_install(url);

}
