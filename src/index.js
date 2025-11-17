// import React, { useState } from 'react';

// const isValidUrl = (urlString) => {
//   if (!urlString || urlString.trim() === '') return null;

//   const basicRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/i;
//   if (!basicRegex.test(urlString)) {
//     return false;
//   }

//   let fullUrl = urlString;
//   if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
//     fullUrl = `https://${fullUrl}`;
//   }

//   try {
//     new URL(fullUrl);
//     return true;
//   } catch (e) {
//     return false;
//   }
// };

// const App = () => {
//   const [urlInput, setUrlInput] = useState('');
//   const [validationStatus, setValidationStatus] = useState(null);

//   const handleInputChange = (event) => {
//     const newUrl = event.target.value;
//     setUrlInput(newUrl);

//     setValidationStatus(isValidUrl(newUrl));
//   };

//   const inputClass = `w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors duration-300 shadow-inner
//     ${validationStatus === true ? 'border-green-500 focus:ring-green-500' :
//       validationStatus === false ? 'border-red-500 focus:ring-red-500' :
//       'border-gray-300 focus:ring-blue-500'}`;

//   const statusMessage = () => {
//     if (validationStatus === true) {
//       return (
//         <span className="text-green-600">
//           <span className="mr-3 text-2xl">✅</span>
//           <span className="font-bold">Valid URL</span>
//         </span>
//       );
//     }
//     if (validationStatus === false) {
//       return (
//         <span className="text-red-600">
//           <span className="mr-3 text-2xl">❌</span>
//           <span className="font-bold">Invalid URL</span>
//         </span>
//       );
//     }
//     return <span className="text-gray-500">Start typing a URL...</span>;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-xl bg-white p-8 md:p-10 rounded-3xl shadow-2xl space-y-6">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6">
//           Live URL Validator
//         </h1>

//         <p className="text-gray-600 text-center mb-8">
//           Enter text below to check for a valid web address pattern in real time.
//         </p>

//         <div className="relative">
//           <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
//             URL Input:
//           </label>
//           <input
//             id="url-input"
//             type="text"
//             value={urlInput}
//             onChange={handleInputChange}
//             placeholder="e.g., https://www.project-gemini.dev/tools"
//             className={inputClass}
//             aria-live="polite"
//           />
//         </div>

//         <div className="h-10 pt-2 flex items-center text-xl font-semibold">
//           {statusMessage()}
//         </div>

//         <div className="pt-4 mt-6 border-t border-gray-100">
//           <h3 className="text-lg font-bold text-gray-700 mb-2">Examples:</h3>
//           <ul className="text-sm text-gray-500 space-y-1 list-none p-0 m-0">
//             <li className="flex items-start">
//               <span className="w-24 font-bold text-green-700">Valid:</span>
//               <span className="font-mono text-gray-700">https://docs.google.com</span>
//             </li>
//             <li className="flex items-start">
//               <span className="w-24 font-bold text-green-700">Valid:</span>
//               <span className="font-mono text-gray-700">www.nasa.gov/mars</span>
//             </li>
//             <li className="flex items-start">
//               <span className="w-24 font-bold text-red-700">Invalid:</span>
//               <span className="font-mono text-gray-700">just a sentence</span>
//             </li>
//             <li className="flex items-start">
//               <span className="w-24 font-bold text-red-700">Invalid:</span>
//               <span className="font-mono text-gray-700">ft p://server.net</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;



import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
