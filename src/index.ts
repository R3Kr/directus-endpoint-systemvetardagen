import { defineEndpoint } from "@directus/extensions-sdk";
import { z } from "zod";

const userSchema = z.object({
  data: z.array(
    z.object({
      first_name: z.union([z.string(), z.null()]),
      tags: z.union([z.array(z.string()), z.null()]),
    })
  ),
});

if (!process.env.COMPANY_PASSWORD) {
  throw Error("COMPANY_PASSWORD env not configured");
}

if (!process.env.ACCOUNT_API_KEY) {
  throw Error("ACCOUNT_API_KEY env not configured");
}

export default defineEndpoint({
  id: "systemvetardagen",
  handler: (router) => {
    router.get("/", async (req, res) => {
      const headers = await fetch("http://localhost:8055/auth/login", {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer: "http://localhost:8055/admin/login",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `{\"email\":\"${req.query.c}@example.com\",\"password\":\"${process.env.COMPANY_PASSWORD}\",\"mode\":\"cookie\"}`,
        method: "POST",
      }).then((r) => r.headers);

      //const token = resp.data.access_token
      res.header("Set-Cookie", headers.getSetCookie());
      res.redirect("/admin/content/companies/+");
    });
    router.get("/firebasesuger!", async (req, res) => {
      //3ToJqZ4VVJLrG_svlP2znqxOzObxDz3w
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${process.env.ACCOUNT_API_KEY}`);

      const resp = await fetch("http://0.0.0.0:8055/users", {
        headers: headers,
      }).then((r) => r.json());
      const companies = userSchema
        .parse(resp)
        .data.filter((u) => u.tags?.includes("company"));

      res.send(`<html> 
                  <h1>Login links:</h1>
                   <ul>${companies.map(
                     (u) =>
                       `<li><a href=${process.env.PUBLIC_URL}systemvetardagen?c=${u.first_name}>${u.first_name}</a></li>`
                   )}</ul>



                   <h1>Create company account</h1>
                   <form action="/systemvetardagen/createaccount">
                      <label for="fname">Company name:</label><br>
                      <input type="text" id="name" name="name" value=""><br>
                      <input type="submit" value="Create">
                   </form>
                   
              </html>`);
    });

    router.get("/createaccount", async (req, res) => {
      const name = z.string().nonempty().parse(req.query.name);

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${process.env.ACCOUNT_API_KEY}`);
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      const body = {
        first_name: name,
        email: `${name}@example.com`,
        password: process.env.COMPANY_PASSWORD,
        role: "4e61f8f9-16aa-48ab-a746-11ebd314a3f2",
        tags: ["company"],
      };

      const resp = await fetch("http://0.0.0.0:8055/users", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (resp.status === 200) {
        return res.redirect("/systemvetardagen/firebasesuger!");
      }

      return res.send(`<html>
                          ${resp}
      
                      </html>`);
    });
  },
});
//"/directus/extensions/endpoints/directus-endpoint-systemvetardagen/index.html"
