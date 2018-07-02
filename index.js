var Promise = require("bluebird"); 
var axios = require("axios"); 

async function mkdirAsync(folder, fs){
    return new Promise((res, rej)=>{
        fs.mkdir(folder, ()=>{
            res();
        });
    })
}

async function writeFileAsync(file, data, fs){
    return new Promise((res, rej)=>{
        fs.writeFile(file, data, ()=>{
            res();
        });
    })
}

async function readFileAsync(file, fs){
    return new Promise((res, rej)=>{
        fs.readFile(file, (err,d)=>{
            res(d);
        });
    })
}

async function readdirAsync(dir, fs){
    return new Promise((res, rej)=>{
        fs.readdir(dir, (err,d)=>{
            res(d);
        });
    })
}

async function runApp(cb){

    BrowserFS.FileSystem.IndexedDB.Create({}, async (e, idbfs)=> {    
    
        BrowserFS.initialize(idbfs);
        var content = {};        
        var fs = BrowserFS.BFSRequire('fs');   


        await axios.get('https://d1jyvh0kxilfa7.cloudfront.net/v1/combinations/md5@2.2.1.json')
        //axios.get('https://d1jyvh0kxilfa7.cloudfront.net/v1/combinations/sha256@0.2.0.json')
        .then(async (response) =>{     

            var contents = response.data.contents;      
            var contentsKeys = Object.keys(contents);
    
            contentsKeys.forEach(async (v,i)=>{              
                var folders = v.split('/');
                var file = "/"+folders.pop();
                var path = "";
                folders.forEach(async (f,fi)=>{
                    if(f != ""){
                        path += "/" + f;
                        try{ 
                            // console.log(path);
                            await mkdirAsync(path, fs);
                        }catch(err){
                            //console.log('exists already');
                        }
                    }
                    //console.log(f);
                });                
                //console.log( path + file )
                await writeFileAsync(path + file, contents[v].content, fs);
            });
                      
        });
    
        // fs.writeFile('/app.2.2', JSON.stringify(data), (err)=>{});          
        //console.log(fs);

        // await mkdirAsync('/node_modules', fs);
        // await mkdirAsync('/node_modules/test-app', fs);
        // await writeFileAsync('/node_modules/test-app/package.json', '{ "name": "test-app", "version": "1.0.0", "description": "", "keywords": [], "main": "./index.js" }', fs);
        // await writeFileAsync('/node_modules/test-app/index.js', ' console.log("Test App") ', fs);
        // await writeFileAsync('/main.js', ' require("test-app") ', fs);

        var dir = await readdirAsync('/node_modules', fs);

        console.log('dir', dir);
        
        var main = await readFileAsync('/main.js', fs);
        var testapp_pack = await readFileAsync('/node_modules/test-app/package.json', fs);
        var testapp      = await readFileAsync('/node_modules/test-app/index.js', fs);
        
        content['/main.js'] = main.toString();
        content['/node_modules/test-app/package.json'] = testapp_pack.toString();
        content['/node_modules/test-app/index.js'] = testapp.toString();

        //console.log(f.toString());

        cb(content);

    });
    
}

runApp((content)=>{

    console.log('content', content);

    BrowserFS.FileSystem.InMemory.Create(async (e, inMemory)=> {    
     
        BrowserFS.initialize(inMemory);
        var fs = BrowserFS.BFSRequire('fs');   
        

        fs.mkdirSync('/node_modules', fs);
        fs.mkdirSync('/node_modules/test-app', fs);        
        fs.writeFileSync('/node_modules/test-app/package.json', content['/node_modules/test-app/package.json']);
        fs.writeFileSync('/node_modules/test-app/index.js', content['/node_modules/test-app/index.js']);
        fs.writeFileSync('/main.js', content['/main.js']);

        Module = browserfsModule.Module;                          
        var main = Module._load("/main");

        console.log(fs);

    });
});
