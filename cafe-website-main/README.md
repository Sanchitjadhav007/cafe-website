# cafe-website

## MongoDB reviews

Reviews are saved through the Netlify function at `/.netlify/functions/save-review`.

Before deploying, add this environment variable in Netlify:

```text
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

You can also use `MONGODB_URI`; the function checks both names.
