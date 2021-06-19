@app
begin-redwood

@static
folder web/dist

#@begin
#hydrate echo Skipping hydrate!

@http
/.redwood/functions/graphql
  method post
  src begin/api/dist/graphql
# /graphiql
#   method get
#   src graphiql



# @aws
# profile default
# region us-west-1
