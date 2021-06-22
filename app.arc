
    @app
    begin-redwood

    @static
    folder ./web/dist

    @http
    /.redwood/functions/graphql
      method post
      src .begin/api/dist/graphql
      
  