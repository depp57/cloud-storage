# Rest API documentation

## Routes

<table>
<tr>
  <td>
  	<b>Route</b>
  </td>

  <td>
  	<b>Method</b>
  </td>

  <td>
  	<b>Request parameters</b>
  </td>

  <td> 
  	<b>Response</b>
  </td>

  <td> 
  	<b>Request exemple</b>
  </td>
</tr>

<tr>
  <td> /files/list </td>

  <td> GET </td>

  <td> filePath: slug(string) </td>
  <td>

  ```json
  {
    "result": 
    [
      {
        "filePath": "/foo/bar.pdf",
        "type": "file"
      },
      {
        "filePath": "/foo/bar/baz",
        "type": "dir"
      }
    ]
  }
  ```

  </td>

  <td>

  `/files/list?filePath=foo/bar/`

  </td>
</tr>


<tr>
  <td> /files/dl </td>

  <td> GET </td>

  <td> filePath: slug(string) </td>
  <td> File (over HTTP) </td>

  <td>

  `/files/dl?filePath=foo/bar.pdf`

  </td>
</tr>


<tr>
  <td> /files/update </td>
  
  <td> PUT </td>

  <td> 
    filePath: slug(string)<br>
    type: &lt dir, file &gt <br>
    file: bytes 
  </td>
  
  <td>

  ```json
  {
    "registered": true
  }
  ```

  </td>

  <td>

  `/files/update`

  </td>
</tr>


<tr>
  <td> /files/update </td>
  
  <td> POST </td>

  <td> 
    filePath: slug(string)<br>
    newFilePath: slug(string) 
  </td>
  
  <td>

  ```json
  {
    "changed": true
  }
  ```

  </td>

  <td>

  `/files/update`

  </td>
</tr>


<tr>
  <td> /files/update </td>
  
  <td> DELETE </td>

  <td> filePath: slug(string) </td>
  <td>

  ```json
  {
    "deleted": true
  }
  ```

  </td>

  <td>

  `/files/update`

  </td>
</tr>


<tr>
  <td> /auth </td>
  
  <td> POST </td>

  <td> filePath: slug(string) </td>
  <td>

  ```json
  {
    "token": "zXB3gT82q9TwwPtbsd1P"
  }
  ```

  </td>

  <td>

  `/auth`

  </td>
</tr>

</table>


## Errors

In case of an error, the server will always send this kind of json response :

```json
{
  "error": "BAD_CREDENTIALS"
}
```
