import { z } from "zod";
import { userSchema, hash } from ".";

interface Company {
  id: string;
  first_name: string | null;
  tags: string[] | null;
}

export const getHtml = (companies: Company[]) => `<html>
<head>
        
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@500&family=Work+Sans&display=swap');
			body {
				font-family: 'Work Sans', sans-serif;
				background-color: #FFC0CB;
				padding: 1rem;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			
			h1, h2 {
				font-family: 'Overpass', sans-serif;
			}
			
			input {
				font-family: 'Work Sans', sans-serif;
			}
			
			form {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0;
			}
			
			ul {
				list-style: none;
				padding: 0;
				display: flex;
				flex-direction: column;
				width: fit-content;
			}
			
			li {
				border-top: 1px solid gray;
				border-left: 1px solid gray;
				border-right: 1px solid gray;
				padding: 0.8rem 1rem;
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				background-color: rgb(255, 255, 255);
				font-size: 1.2rem;
			}
			
			li:first-child {
				border-top: 1px solid gray;
			}
			
			li:nth-child(even) {
				background-color: rgb(237, 237, 237);
			} 
			
			li:last-child {
				border-bottom: 1px solid gray;
			}
			
			li a {
				color: rgb(0, 0, 0);
				margin-right: 2rem;
			}
			
			#name {
				width: 250px;
				height: 2rem;
				font-size: 1rem;
				border-radius: 999em;
				padding: 0 1rem;
				border: none;
				margin-bottom: 1rem;
				margin-top: 0.5rem;
				text-align: center;
			}
			
			#name::placeholder {
				font-size: 0.8rem;
			}
			
			#name:focus {
				box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
			}
			
			.button {
				background-color: rgb(23, 23, 23);
				color: pink;
				border: none;
				padding: 0.5rem 1.2rem;
				font-size: 0.8rem;
			}
			
			.button:hover {
				outline: 4px solid white;
				color: white;
				cursor: pointer;
			}
			
			.copy-button {
				padding: 0.4rem 1rem;
				background-color: rgb(255, 255, 255);
				border: 1px solid black;
				border-radius: 999em;
			}
			
			.copy-button:hover {
				background-color: rgb(255, 223, 229);
				cursor: pointer;
			}
			
			/* Tooltip container */
			.tooltip {
				position: relative;
				display: inline-block;
				/*border-bottom: 1px dotted black; If you want dots under the hoverable text */
			}
			
			/* Tooltip text */
			.tooltip .tooltiptext {
				visibility: hidden;
				width: 160px;
				background-color: black;
				color: #fff;
				text-align: center;
				padding: 5px 0;
				border-radius: 6px;
			 
				/* Position the tooltip text - see examples below! */
				bottom: 130%;
				left: 50%;
				margin-left: -80px;
				position: absolute;
				z-index: 1;
			}
			
			.tooltip .tooltiptext::after {
				content: " ";
				position: absolute;
				top: 100%; /* At the bottom of the tooltip */
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: black transparent transparent transparent;
			}
			
			/* Show the tooltip text when you mouse over the tooltip container */
			.tooltip:hover .tooltiptext {
				visibility: visible;
			}
			
			svg {
				width: 5rem;
				color: black;
			}
			
		</style>
</head>
<body>
		<svg data-v-925b5366="" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1000" class="logo"><title>Symbol_&amp;amp;_Text_Logo_White</title><path d="M164.33,874.67l-108-49.42L424.12,62.07l107.15,49.42Zm337.64,0-108-49.42L761.76,62.07l107.15,49.42Z" fill="#fff"></path><path d="M1063.44,221.91a56.33,56.33,0,0,0-14.88-8.95,39.44,39.44,0,0,0-14.41-2.91q-8.85,0-14.42,4.19a13,13,0,0,0-5.58,10.93,10.86,10.86,0,0,0,2.79,7.67,24.37,24.37,0,0,0,7.32,5.23,63.68,63.68,0,0,0,10.24,3.84q5.68,1.62,11.27,3.48,22.32,7.46,32.67,19.88t10.34,32.43a63.21,63.21,0,0,1-4.53,24.42A50.93,50.93,0,0,1,1071,340.83a61.05,61.05,0,0,1-21.39,12.09,89,89,0,0,1-28.72,4.3q-33.24,0-61.61-19.76l19.53-36.73A79.12,79.12,0,0,0,999,314.21a48.51,48.51,0,0,0,19.76,4.42q11.16,0,16.62-5.12t5.47-11.62a15.73,15.73,0,0,0-1.4-6.86,14.86,14.86,0,0,0-4.65-5.35,37.26,37.26,0,0,0-8.48-4.53c-3.49-1.4-7.71-2.94-12.67-4.65q-8.85-2.79-17.32-6.16a54.6,54.6,0,0,1-15.12-8.95,41.64,41.64,0,0,1-10.69-14.07q-4.08-8.49-4.07-21.51a62.06,62.06,0,0,1,4.3-23.59,52.58,52.58,0,0,1,12.09-18.14A54,54,0,0,1,1002,176.34a72,72,0,0,1,25.22-4.18,110.48,110.48,0,0,1,27.2,3.6,119.76,119.76,0,0,1,27.2,10.58Z" fill="#fff"></path><path d="M1159.92,268.18,1096,177h54.4l32.55,47.89L1215.26,177h54.4l-64.17,91.14v84.16h-45.57Z" fill="#fff"></path><path d="M1373.82,221.91a56.33,56.33,0,0,0-14.88-8.95,39.44,39.44,0,0,0-14.41-2.91q-8.85,0-14.42,4.19a13,13,0,0,0-5.58,10.93,10.86,10.86,0,0,0,2.79,7.67,24.29,24.29,0,0,0,7.33,5.23,63.2,63.2,0,0,0,10.23,3.84q5.68,1.62,11.27,3.48,22.32,7.46,32.67,19.88t10.34,32.43a63.21,63.21,0,0,1-4.53,24.42,50.93,50.93,0,0,1-13.25,18.71A61.05,61.05,0,0,1,1360,352.92a89,89,0,0,1-28.72,4.3q-33.24,0-61.61-19.76l19.53-36.73a79.12,79.12,0,0,0,20.23,13.48,48.51,48.51,0,0,0,19.76,4.42q11.16,0,16.62-5.12t5.47-11.62a15.73,15.73,0,0,0-1.4-6.86,14.86,14.86,0,0,0-4.65-5.35,37.47,37.47,0,0,0-8.48-4.53c-3.49-1.4-7.71-2.94-12.67-4.65q-8.85-2.79-17.32-6.16a54.6,54.6,0,0,1-15.12-8.95,41.64,41.64,0,0,1-10.69-14.07q-4.08-8.49-4.07-21.51a62.06,62.06,0,0,1,4.3-23.59,52.58,52.58,0,0,1,12.09-18.14,54,54,0,0,1,19.06-11.74,72.1,72.1,0,0,1,25.23-4.18,110.48,110.48,0,0,1,27.2,3.6,119.76,119.76,0,0,1,27.2,10.58Z" fill="#fff"></path><path d="M1490.77,215.63V352.34H1445.2V215.63h-37.43V177H1528.2v38.59Z" fill="#fff"></path><path d="M1648.16,215.63H1594v29.3h51.15v38.59H1594v30.23h54.17v38.59h-99.73V177h99.73Z" fill="#fff"></path><path d="M1668.39,352.34,1698.15,177h45.1l35.11,93.46L1813.24,177h45.1l29.76,175.3h-45.34l-15.11-100.9-41.38,100.9h-18.14l-39.29-100.9-15.11,100.9Z" fill="#fff"></path><path d="M1019.49,385.29l51.36,129.51,51.63-129.51h60.11L1092.85,598h-44L959.39,385.29Z" fill="#fff"></path><path d="M1325.92,432.13h-65.74v35.55h62.07v46.84h-62.07V551.2h65.74V598H1204.87V385.29h121.05Z" fill="#fff"></path><path d="M1446.4,432.13V598h-55.3V432.13h-45.43V385.29h146.16v46.84Z" fill="#fff"></path><path d="M1619.93,561.08h-79l-12.7,37h-59l81-212.75h60.38l81,212.75h-59Zm-14.67-42-24.83-70.83L1555.6,519Z" fill="#fff"></path><path d="M1887.14,598h-68.85l-52.76-81.83V598h-55.3V385.29h86q17.79,0,31,5.22a58.44,58.44,0,0,1,34.85,35.13,72.64,72.64,0,0,1,4.37,25.39q0,24.27-11.71,39.37t-34.56,20.45ZM1765.53,480.38H1776q16.37,0,25.11-6.77t8.75-19.47q0-12.7-8.75-19.47T1776,427.9h-10.44Z" fill="#fff"></path><path d="M960.72,631.33h73.53a86.91,86.91,0,0,1,36.64,7.86,100.18,100.18,0,0,1,29.92,20.92A97.35,97.35,0,0,1,1121,690.54a93.82,93.82,0,0,1,.12,72.52,96.55,96.55,0,0,1-20,30.55,98.79,98.79,0,0,1-29.92,21,87.33,87.33,0,0,1-36.89,7.86H960.72Zm49.69,149.1h11.41a61.68,61.68,0,0,0,23.08-4.06A49.12,49.12,0,0,0,1062,765.21a47.68,47.68,0,0,0,10.65-16.86,60.32,60.32,0,0,0,3.68-21.42,58.93,58.93,0,0,0-3.8-21.3,47.78,47.78,0,0,0-27.9-28.15,61.08,61.08,0,0,0-22.82-4.06h-11.41Z" fill="#fff"></path><path d="M1264,789.3h-71l-11.41,33.22h-53l72.77-191.19h54.27l72.77,191.19h-53Zm-13.18-37.78-22.32-63.64-22.31,63.64Z" fill="#fff"></path><path d="M1432.08,715.52h98.64a275.33,275.33,0,0,1-1.27,27.63,98,98,0,0,1-5.07,23.08,92.39,92.39,0,0,1-14.45,26.5A84.71,84.71,0,0,1,1488.5,812a101,101,0,0,1-27,11.79,115.94,115.94,0,0,1-30.93,4.05q-22.3,0-40.7-7.35a91.66,91.66,0,0,1-31.56-20.67,93.38,93.38,0,0,1-20.54-31.94q-7.37-18.64-7.36-41.21a112.35,112.35,0,0,1,7.23-40.95,89.86,89.86,0,0,1,20.54-31.82,93.33,93.33,0,0,1,32.08-20.54Q1409,626,1432.08,626q29.93,0,52.49,12.93T1520.32,679l-47.16,19.53q-6.6-15.72-17.12-22.57a43,43,0,0,0-24-6.85,48.06,48.06,0,0,0-20.28,4.19,44,44,0,0,0-15.6,11.91,57.34,57.34,0,0,0-10.14,18.64,75.9,75.9,0,0,0-3.67,24.34,77.15,77.15,0,0,0,3.16,22.57,51.16,51.16,0,0,0,9.51,18,42.74,42.74,0,0,0,15.72,11.79,53.07,53.07,0,0,0,21.81,4.19,60.45,60.45,0,0,0,14.2-1.65,37.6,37.6,0,0,0,12.3-5.32,30.35,30.35,0,0,0,9-9.51,38.31,38.31,0,0,0,4.82-14.2h-40.83Z" fill="#fff"></path><path d="M1665.86,673.42h-59.08v32h55.79v42.09h-55.79v33h59.08v42.09H1557.09V631.33h108.77Z" fill="#fff"></path><path d="M1696.54,822.52V631.33h49.7L1838,748.22V631.33h49.45V822.52H1838l-91.79-116.89V822.52Z" fill="#fff"></path></svg>
		<h1>Create company account</h1>
		<form action="/systemvetardagen/createaccount">
				<label for="fname">Company name:</label>
				<input type="text" id="name" name="name" value="" placeholder="First letter must be capitalized">
				<input type="submit" class="button" value="Create">
		</form>

		<h1>Login links:</h1>
		<ul>
        ${companies.map(
          (c) => `<li>
                <a href=${process.env.PUBLIC_URL}systemvetardagen?c=${
                  c.first_name
                }&h=${hash(c.first_name)}>${c.first_name}</a>
                    <button class="copy-button tooltip">Copy
                       <span class="tooltiptext">Copy link to clipboard</span>
                     </button>
                </li>`
        ).join('')}
               
		</ul>
</body>
<script src=https://systemvetardagencms.up.railway.app/assets/2e132437-838e-4d2b-8a7b-98729d1210c8.js defer></script>
</html>`;
