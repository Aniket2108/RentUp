import React from "react";
import axios from "axios";

export const serverUrl = "http://localhost:8080";

// Create axios instance with token interceptor
export const api = axios.create({
  baseURL: serverUrl,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid, logout
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getCities = async () => {
  try {
    const response = await axios.get(`${serverUrl}/city`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const getNavData = (user) => {
  const navData = [
    {
      text: "home",
      path: "/",
    },
    {
      text: "about",
      path: "/about",
    },
    {
      text: "contact",
      path: "/contact",
    },
    {
      text: "add property",
      path: "/property",
    },
    { text: user ? 'Logout' : 'Login', path: user? '/logout':'/login'},
    { text:user? 'Profile':'Sign up', path: user?'/profile':'/signup' },
  ];

  if (user && user.role === 'ADMIN') {
    navData.splice(navData.length - 2, 0, { text: 'Admin', path: '/admin' });
  }

  return navData;
};

export const featured = [
  {
    cover: "../images/hero/h1.png",
    name: "Family House",
    total: "122 Property",
  },
  {
    cover: "../images/hero/h2.png",
    name: "House & Villa",
    total: "155 Property",
  },
  {
    cover: "../images/hero/h3.png",
    name: "Apartment",
    total: "300 Property",
  },
  {
    cover: "../images/hero/h4.png",
    name: "Office & Studio",
    total: "80 Property",
  },
  {
    cover: "../images/hero/h6.png",
    name: "Villa & Condo",
    total: "80 Property",
  },
];

export const list = [
  {
    id: 1,
    cover: "../images/list/p-1.png",
    name: "Red Carpet Real Estate",
    location: "210 Zirak Road, Canada",
    category: "For Rent",
    price: "$3,700",
    type: "Apartment",
  },
  {
    id: 2,
    cover: "../images/list/p-2.png",
    name: "Fairmount Properties",
    location: "5698 Zirak Road, NewYork",
    category: "For Sale",
    price: "$9,750",
    type: "Condos",
  },
  {
    id: 3,
    cover: "../images/list/p-7.png",
    name: "The Real Estate Corner",
    location: "5624 Mooker Market, USA",
    category: "For Rent",
    price: "$5,860",
    type: "Offices",
  },
  {
    id: 4,
    cover: "../images/list/p-4.png",
    name: "Herringbone Realty",
    location: "5621 Liverpool, London",
    category: "For Sale",
    price: "$7,540",
    type: "Homes & Villas",
  },
  {
    id: 5,
    cover: "../images/list/p-5.png",
    name: "Brick Lane Realty",
    location: "210 Montreal Road, Canada",
    category: "For Rent",
    price: "$4,850",
    type: "Commercial",
  },
  {
    id: 6,
    cover: "../images/list/p-6.png",
    name: "Banyon Tree Realty",
    location: "210 Zirak Road, Canada",
    category: "For Sale",
    price: "$2,742",
    type: "Apartment",
  },
];

export const awards = [
  {
    icon: <i className="fa-solid fa-trophy" />,
    num: "32 M ",
    name: "Blue Burmin Award",
  },
  {
    icon: <i className="fa-solid fa-briefcase" />,
    num: "43 M",
    name: "Mimo X11 Award",
  },
  {
    icon: <i className="fa-solid fa-lightbulb" />,
    num: "51 M",
    name: "Australian UGC Award",
  },
  {
    icon: <i className="fa-solid fa-heart" />,
    num: "42 M",
    name: "IITCA Green Award",
  },
];

export const location = [
  {
    id: 1,
    name: "Mumbai",
    Villas: "12 Villas",
    Apartments: "10 Apartments",
    Offices: "07 Offices",
    cover: "./images/location/city-1.png",
  },
  {
    id: 2,
    name: "Pune",
    Villas: "12 Villas",
    Apartments: "10 Apartments",
    Offices: "07 Offices",
    cover: "./images/location/city-2.png",
  },
  {
    id: 3,
    name: "Delhi",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: "./images/location/city-3.png",
  },
  {
    id: 4,
    name: "Bangalore",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: "./images/location/city-4.png",
  },
  {
    id: 5,
    name: "Kolkata",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: "./images/location/city-5.png",
  },
  {
    id: 6,
    name: "Chennai",
    Villas: "12 Villas",
    Apartments: " 10 Apartments",
    Offices: "07 Offices",
    cover: "./images/location/city-6.png",
  },
];

export const team = [
  {
    list: "50",
    cover: "../images/customer/team-1.jpg",
    address: "Liverpool, Canada",
    name: "Sargam S. Singh",
    icon: [<i className="fa-brands fa-facebook-f" />, <i className="fa-brands fa-linkedin" />, <i className="fa-brands fa-twitter" />, <i className="fa-brands fa-instagram" />],
  },
  {
    list: "70",
    cover: "../images/customer/team-2.jpg",
    address: "Montreal, Canada",
    name: "Harijeet M. Siller",
    icon: [<i className="fa-brands fa-facebook-f" />, <i className="fa-brands fa-linkedin" />, <i className="fa-brands fa-twitter" />, <i className="fa-brands fa-instagram" />],
  },
  {
    list: "80",
    cover: "../images/customer/team-3.jpg",
    address: "Denever, USA",
    name: "Anna K. Young",
    icon: [<i className="fa-brands fa-facebook-f" />, <i className="fa-brands fa-linkedin" />, <i className="fa-brands fa-twitter" />, <i className="fa-brands fa-instagram" />],
  },
  {
    list: "51",
    cover: "../images/customer/team-4.jpg",
    address: "2272 Briarwood Drive",
    name: "Michael P. Grimaldo",
    icon: [<i className="fa-brands fa-facebook-f" />, <i className="fa-brands fa-linkedin" />, <i className="fa-brands fa-twitter" />, <i className="fa-brands fa-instagram" />],
  },
  {
    list: "42",
    cover: "../images/customer/team-5.jpg",
    address: "2272 Briarwood Drive",
    name: "Michael P. Grimaldo",
    icon: [<i className="fa-brands fa-facebook-f" />, <i className="fa-brands fa-linkedin" />, <i className="fa-brands fa-twitter" />, <i className="fa-brands fa-instagram" />],
  },
  {
    list: "38",
    cover: "../images/customer/team-5.jpg",
    address: "Montreal, USA",
    name: "Adam K. Jollio",
    icon: [<i className="fa-brands fa-facebook-f" />, <i className="fa-brands fa-linkedin" />, <i className="fa-brands fa-twitter" />, <i className="fa-brands fa-instagram" />],
  },
];

export const price = [
  {
    plan: "Silver",
    price: "199",
    ptext: "per month",
    list: [
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Login from 2 Devices",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Add Free Experience",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "1 month customer support for rented property",
      },
      { change: "color", icon: <i className="fa-solid fa-x" />, text: "List Unlimited Properties in a month" },
      { change: "color", icon: <i className="fa-solid fa-x" />, text: "Contact Unlimited Brokers" },
    ],
  },
  {
    best: "Best Value",
    plan: "Gold",
    price: "299",
    ptext: "per month",
    list: [
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Login from 4 Devices",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Add Free Experience",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "2 month customer support for rented property",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "List Unlimited Properties in a month",
      },
      {
        change: "color",
        icon: <i className="fa-solid fa-x" />,
        text: "Contact Unlimited Brokers",
      },
    ],
  },
  {
    plan: "Platinum",
    price: "499",
    ptext: "per month",
    list: [
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Login from 8 Devices",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Add Free Experience",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "List Unlimited Properties in a month",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "1 month customer support for rented property",
      },
      {
        icon: <i className="fa-solid fa-check" />,
        text: "Contact Unlimited Brokers",
      },
    ],
  },
];

export const footer = [
  {
    title: "LAYOUTS",
    text: [{ list: "Home Page" }, { list: "About Page" }, { list: "Service Page" }, { list: "Property Page" }, { list: "Contact Page" }, { list: "Single Blog" }],
  },
  {
    title: "ALL SECTIONS",
    text: [{ list: "Headers" }, { list: "Features" }, { list: "Attractive" }, { list: "Testimonials" }, { list: "Videos" }, { list: "Footers" }],
  },
  {
    title: "COMPANY",
    text: [{ list: "About" }, { list: "Blog" }, { list: "Pricing" }, { list: "Affiliate" }, { list: "Login" }, { list: "Changelog" }],
  },
];

export const socialMediaLinks = [
  { platform: "Facebook", link: "https://www.facebook.com/yourpage" },
  { platform: "Twitter", link: "https://twitter.com/yourpage" },
  { platform: "Instagram", link: "https://www.instagram.com/yourpage" },
];

export const teamMembers = [
  {
    name: "Kamlesh Deokar",
    prn: "230940120051",
    college: "CDAC ACTS",
    profilePicture: "../images/customer/kmalesh.jpg",
  },
  {
    name: "Suraj Wankhade",
    prn: "230940120203",
    college: "CDAC ACTS",
    profilePicture: "../images/customer/Suraj.jpg",
  },
  {
    name: "Akash Gholve",
    prn: "230940120063",
    college: "CDAC ACTS",
    profilePicture: "src/components/images/customer/Akash.jpg",
  },
  {
    name: "Rohan Auti",
    prn: "230940120155",
    college: "CDAC ACTS",
    profilePicture: "../images/customer/Rohan.jpg",
  },
  {
    name: "Aniket ",
    prn: "230940120024",
    college: "CDAC ACTS",
    profilePicture: "../images/customer/Aniket.jpg",
  },
];

export const getAreas = async (city) => {
  try {
    const response = await axios.get(`${serverUrl}/area/${city}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching areas for ${city}:`, error);
    return [];
  }
};

export const getAllProperties = async () => {
  try {
    const response = await axios.get(`${serverUrl}/properties`);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};
