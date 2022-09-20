
<div align=center>
  <h2>node-rest-api-ds2</h2>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png" style="width:320px;"/>
</div>

## Description
  **Simple REST API**
## Routes
 
* Users 
  * POST    /users 
  
        {
          name:string,
          email:string,
          password:string
        }
        
  * POST    /users/oauth
  
         {
          email:string,
          password:string
         }
         
  * GET     /users
  
  * GET     /users/:id
  
  * PUT     /users/ 
  
  **Need Token in headers:{authorization:token}**
  
        {
          name?:string,
          password?:string
        }

  * DELETE  /users
  
* Albums

  **Need Token in headers:{authorization:token}**
  
  * POST    /albums 
  
        {
          name:string,
          release_date:Date,
          authors:Array<string>,
          musics:Array<Music>?
        } 
  
  * GET     /albums 
  
  * GET     /albums/:id 
  
  * PUT     /albums 
  
        {
          name:string?,
          release_date:Date?,
          authors:Array<string>?
        }
  
  * DELETE  /albums 
  
        {
          id:integer
        }
  
* Musics

  **Need Token in headers:{authorization:token}**
  
  * POST    /musics 
  
        {
          name:string,
          duration:integer,
          formats:Array<string>,
          authors:Array<string>?,
          albumId:integer
        }
  
  * GET     /musics
  
  
  * GET     /musics/:id
  
  
  * PUT     /musics/:id 
 
        {
            name:string?,
            duration:integer?,
            formats:Array<string>?,
            authors:Array<string>?,
            albumId:integer?
        }
  
  * DELETE  /musics 
  
        {
          id:integer
        }


## How to run
* Install Dependencies

        yarn install
* Run test

        yarn test
* Init Server

        yarn dev
      
