import { defineEndpoint } from "@directus/extensions-sdk";
import { z } from "zod";
import { createHash } from "crypto";
import { getHtml } from "./html";

export const userSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      first_name: z.union([z.string(), z.null()]),
      tags: z.union([z.array(z.string()), z.null()]),
    })
  ),
});

const companiesSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
    })
  ),
});

if (!process.env.COMPANY_PASSWORD) {
  throw Error("COMPANY_PASSWORD env not configured");
}

if (!process.env.ACCOUNT_API_KEY) {
  throw Error("ACCOUNT_API_KEY env not configured");
}

if (!process.env.COMPANY_ROLE) {
  throw Error("COMPANY_ROLE env not configured");
}
if (!process.env.ADMIN_ENDPOINT) {
  throw Error("ADMIN_ENDPOINT env not configured");
}
export function hash(s: any) {
  return createHash("md5")
    .update(s)
    .update(process.env.SECRET ?? "dinmamma")
    .digest("hex");
}

const apiHeaders = new Headers();
apiHeaders.append("Authorization", `Bearer ${process.env.ACCOUNT_API_KEY}`);
apiHeaders.append("Accept", "application/json");
apiHeaders.append("Content-Type", "application/json");

export default defineEndpoint({
  id: "systemvetardagen",
  handler: (router) => {
    router.get("/", async (req, res) => {
      if (req.query.h !== hash(req.query.c ?? "")) {
        res.status(403);
        return res.send("forbidden bro");
      }

      const getLoginHeaders = async () =>
        await fetch(`${process.env.PUBLIC_URL}auth/login`, {
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

      const getUserCompanyInfo = async (id: string) =>
        await fetch(
          `${process.env.PUBLIC_URL}items/companies?filter[user_created][_eq]=${id}`,
          {
            headers: apiHeaders,
          }
        ).then((r) => r.json());

      const [headers, companyData] = await Promise.all([
        getLoginHeaders(),
        fetch(
          `${process.env.PUBLIC_URL}users?filter[first_name][_eq]=${req.query.c}`,
          { headers: apiHeaders }
        )
          .then((response) => response.json())
          .then((result) => userSchema.parse(result))
          .then((user) => getUserCompanyInfo(user.data[0]?.id ?? ""))
          .then((r) => companiesSchema.parse(r).data[0]),
      ]);

      //const token = resp.data.access_token
      res.header("Set-Cookie", headers.getSetCookie());
      res.redirect(
        companyData
          ? `/admin/content/companies/${companyData.id}`
          : "/admin/content/companies/+"
      );
    });
    router.get(`/${process.env.ADMIN_ENDPOINT}`, async (req, res) => {
      if (!req.cookies["directus_refresh_token"]) {
        res.status(403);
        return res.send("forbidden bro");
      }

      //3ToJqZ4VVJLrG_svlP2znqxOzObxDz3w
      // const headers = new Headers();
      // headers.append("Authorization", `Bearer ${process.env.ACCOUNT_API_KEY}`);

      const resp = await fetch(
        `${process.env.PUBLIC_URL}users?sort=first_name`,
        {
          headers: apiHeaders,
        }
      ).then((r) => r.json());
      const companies = userSchema
        .parse(resp)
        .data.filter((u) => u.tags?.includes("company"));

      // res.send(`<html>
      //           <head>
      //             <style>
      //               body {
      //                 background-color: #FFC0CB;
      //               }
      //             </style>
      //             </head>
      //             <body> 
      //             <h1>Create company account</h1>
      //              <form action="/systemvetardagen/createaccount">
      //                 <label for="fname">Company name:</label><br>
      //                 <input type="text" id="name" name="name" value="" placeholder="First letter must be capitalized"><br>
      //                 <input type="submit" value="Create">
      //              </form>



      //             <h1>Login links:</h1>
      //              <ul>${companies.map(
      //                (u) =>
      //                  `<li><a href=${
      //                    process.env.PUBLIC_URL
      //                  }systemvetardagen?c=${u.first_name}&h=${hash(
      //                    u.first_name
      //                  )}>${u.first_name}</a></li>`
      //              )}</ul>
      //              </body>
      //         </html>`);
      res.send(getHtml(companies));
    });

    router.get("/createaccount", async (req, res) => {
      if (!req.cookies["directus_refresh_token"]) {
        res.status(403);
        return res.send("forbidden bro");
      }

      const name = z
        .string()
        .regex(RegExp("^[A-Z0-9][a-zA-Z0-9]*$"))
        .safeParse(req.query.name);

      if (!name.success) {
        res.status(400);
        return res.send("bad input");
      }

      const body = {
        first_name: name.data,
        email: `${name.data}@example.com`,
        password: process.env.COMPANY_PASSWORD,
        role: process.env.COMPANY_ROLE,
        tags: ["company"],
      };

      const resp = await fetch(`${process.env.PUBLIC_URL}users`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(body),
      });

      if (resp.status === 200) {
        return res.redirect(`/systemvetardagen/${process.env.ADMIN_ENDPOINT}`);
      }

      return res.send(`<html>
                          ${resp}
                          user creation went wrong
      
                      </html>`);
    });

    router.post("/updateprofile",async (req, res) => {
      const body = z.object({
        user: z.string(),
        logo: z.string()
      }).parse(req.body)

      const resp = await fetch(`${process.env.PUBLIC_URL}users/${body.user}`, {
        method: "PATCH",
        headers: apiHeaders,
        body: JSON.stringify({avatar: body.logo}),
      });

      res.status(resp.status)
      res.send(resp.status)
      
    })
  },
});
//"/directus/extensions/endpoints/directus-endpoint-systemvetardagen/index.html"
