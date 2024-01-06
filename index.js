const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wacbf1n.mongodb.net/?retryWrites=true&w=majority`;
const products =
[ {
    name: "Galaxy S21",
    brand: "Samsung",
    date: "2023-01-15",
    price: 799.99,
    rating: 4.5,
    description: "The Galaxy S21 is Samsung's flagship smartphone, representing the pinnacle of mobile innovation. With its sleek design and advanced features, it offers a superior mobile experience. The phone features a 6.2-inch Dynamic AMOLED display that delivers vibrant colors and deep blacks, providing an immersive viewing experience. Powered by the Exynos 2100 processor, it ensures lightning-fast performance, making multitasking effortless. The camera setup includes a 64MP main sensor, 12MP ultra-wide lens, and a 12MP telephoto lens, enabling stunning photos and videos. With 5G connectivity, you can enjoy seamless streaming and fast downloads. The Galaxy S21 is a perfect blend of style, power, and innovation, making it a top choice for tech enthusiasts.",

    type: "phone",
    photo: "https://images.unsplash.com/photo-1610792516286-524726503fb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2FsYXh5JTIwUzIxfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Galaxy Tab S7",
    brand: "Samsung",
    date: "2023-02-20",
    price: 649.99,
    rating: 4.7,
    description: "The Galaxy Tab S7 is Samsung's premium tablet designed for productivity and creativity. With an 11-inch Super AMOLED display and a 120Hz refresh rate, it offers stunning visuals and smooth interactions. Powered by the Snapdragon 888 processor and 8GB of RAM, it handles demanding tasks effortlessly. The tablet comes with the S Pen, providing a natural writing and drawing experience. The dual-camera setup includes a 13MP main sensor and a 5MP ultra-wide lens, enabling high-quality photos and videos. With a large 10,090mAh battery, the Tab S7 offers long hours of usage, making it ideal for work and entertainment. Whether you're sketching, multitasking, or gaming, the Galaxy Tab S7 delivers an exceptional experience.",

    type: "tablet",
    photo: "https://images.unsplash.com/photo-1620288650879-20db0eb38c05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2FsYXh5JTIwVGFiJTIwUzd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Samsung Galaxy Watch 4",
    brand: "Samsung",
    date: "2023-03-25",
    price: 299.99,
    rating: 4.6,
    description: "The Samsung Galaxy Watch 4 is a stylish and feature-packed smartwatch that enhances your daily life. With a 1.4-inch Super AMOLED display and Gorilla Glass DX protection, it offers vibrant visuals and durability. The watch includes advanced health tracking features, such as heart rate monitoring, ECG, and SpO2 measurement, providing valuable insights into your well-being. With over 90 workout modes, it helps you stay active and achieve your fitness goals. The Galaxy Watch 4 also supports sleep tracking and stress management, promoting overall health and wellness. With 16GB of storage, you can store your favorite apps and music offline. With its sleek design, health-focused features, and long-lasting battery life, the Galaxy Watch 4 is the perfect companion for a healthy and connected lifestyle.",

    type: "wearable",
    photo: "https://unsplash.com/photos/a-person-with-a-tattoo-on-their-arm-holding-an-apple-watch-hwn20c-tQrQ"
  },
  {
    name: "Samsung Odyssey G9",
    brand: "Samsung",
    date: "2023-04-10",
    price: 1499.99,
    rating: 4.8,
    description: "The Samsung Odyssey G9 is a gaming monitor designed for enthusiasts seeking an immersive and high-performance gaming experience. With a massive 49-inch curved QLED display, it provides an expansive and wraparound view, pulling you into the game like never before. The monitor features a 240Hz refresh rate and 1ms response time, eliminating motion blur and ensuring smooth gameplay. With a resolution of 5120 x 1440 and support for HDR1000, it delivers stunning visuals with vibrant colors and deep blacks. The Odyssey G9 supports NVIDIA G-Sync and AMD FreeSync Premium Pro, minimizing screen tearing and stuttering. Its Infinity Core Lighting design adds a touch of futuristic aesthetics to your gaming setup. Whether you're into competitive gaming or immersive single-player experiences, the Samsung Odyssey G9 delivers unmatched performance and visual fidelity.",

    type: "monitor",
    photo: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "iPhone 13 Pro",
    brand: "Apple",
    date: "2023-03-10",
    price: 999.99,
    rating: 4.8,
    description: "The iPhone 13 Pro is Apple's latest flagship smartphone, setting new standards for mobile technology. With its ceramic and stainless steel design, it exudes elegance and durability. The phone features a 6.1-inch Super Retina XDR display with ProMotion and HDR10+, delivering stunning visuals with deep blacks and bright highlights. Powered by the A16 Bionic chip, it offers unparalleled performance and efficiency, enabling smooth multitasking and console-quality gaming. The Pro camera system includes a 12MP main sensor, 12MP ultra-wide lens, and a 77mm telephoto lens with 3x optical zoom, allowing you to capture professional-quality photos and videos. With 5G connectivity, Face ID, MagSafe technology, and iOS 16, the iPhone 13 Pro offers a seamless and powerful user experience, making it the ultimate choice for iPhone enthusiasts and creative professionals.",

    type: "phone",
    photo: "https://media.istockphoto.com/id/1401647536/photo/male-hand-holding-phone-isolated-on-white-mock-up-smartphone-blank-screen-with-clipping-path.webp?b=1&s=612x612&w=0&k=20&c=sLojkozdtqARf-G22V34Tz9W-nkwY_jUOEeZ41M71A0= "
  },
  {
    name: "MacBook Air",
    brand: "Apple",
    date: "2023-04-05",
    price: 1199.99,
    rating: 4.6,
    description: "The MacBook Air is Apple's ultra-thin and lightweight laptop, redefining the concept of portable computing. Crafted from 100% recycled aluminum, it's environmentally friendly and aesthetically pleasing. Equipped with the M3 chip, Apple's custom-designed processor, it offers incredible performance for everyday tasks and creative endeavors. The MacBook Air features a 13.3-inch Retina display with True Tone, delivering sharp visuals and accurate colors. The Magic Keyboard provides a comfortable and precise typing experience, making it ideal for long hours of work. With 16GB of unified memory and up to 512GB SSD storage, it offers ample space for your files and applications. Whether you're editing videos, browsing the web, or coding, the MacBook Air ensures a smooth and delightful user experience, making it the perfect choice for professionals and students.",

    type: "laptop",
    photo: "https://cdn.pixabay.com/photo/2016/10/15/13/40/laptop-1742462_640.jpg"
  },
  {
    name: "iPad Air (2023)",
    brand: "Apple",
    date: "2023-02-15",
    price: 599.99,
    rating: 4.7,
    description: "The iPad Air (2023) is Apple's powerful and versatile tablet, designed for productivity, creativity, and entertainment. With its 10.9-inch Liquid Retina display, it offers vivid colors and smooth interactions. Powered by the A15 Bionic chip, it delivers impressive performance for demanding apps and multitasking. The tablet supports the second-generation Apple Pencil, providing a seamless and responsive writing and drawing experience. The iPad Air features a 12MP rear camera that captures detailed photos and supports 4K video recording. With 5G connectivity, you can enjoy fast internet speeds and download large files in an instant. With iPadOS 16, the iPad Air offers new multitasking features and enhanced productivity tools, making it the ultimate tool for professionals, artists, and students.",

    type: "tablet",
    photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBhZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "AirPods Pro",
    brand: "Apple",
    date: "2023-01-05",
    price: 249.99,
    rating: 4.5,
    description: "Introducing the AirPods Pro, Apple's premium wireless earbuds with active noise cancellation and immersive sound quality. These earbuds are designed to deliver a superior audio experience, whether you're listening to music, taking calls, or enjoying podcasts. With Adaptive EQ, the AirPods Pro automatically tunes the music to the shape of your ear, ensuring rich bass and clear highs. The active noise cancellation feature blocks out external sounds, allowing you to focus on your music or conversations. Transparency mode lets you hear the world around you without removing the earbuds. With sweat and water resistance, they are ideal for workouts and outdoor activities. The AirPods Pro provide up to 24 hours of battery life with the included charging case. With easy setup and seamless integration with Apple devices, the AirPods Pro offer a magical and effortless wireless audio experience.",

    type: "earbuds",
    photo: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWlyJTIwcG9kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },{
    name: "Core i9-12900K",
    brand: "Intel",
    date: "2023-02-28",
    price: 599.99,
    rating: 4.9,
    description: "The Intel Core i9-12900K is a high-performance desktop processor designed for gaming and multitasking enthusiasts. With its 16 cores and 24 threads, this processor delivers exceptional processing power, allowing you to tackle demanding applications and games effortlessly. It features a base clock speed of 3.2GHz and a maximum turbo frequency of 5.2GHz, ensuring snappy performance in all scenarios. The Core i9-12900K supports DDR5 memory and PCIe 5.0, offering lightning-fast data transfer speeds and enhancing overall system responsiveness. Additionally, it boasts Intel's latest integrated graphics, providing decent gaming performance without the need for a dedicated GPU. Whether you're gaming, streaming, or content creation, the Core i9-12900K delivers uncompromised performance, making it the ideal choice for high-end desktop systems.",
    type: "processor",
    photo: "https://cdn.pixabay.com/photo/2019/08/08/16/56/cpu-4393384_640.jpg"
  },
  {
    name: "Core i7-12700K",
    brand: "Intel",
    date: "2023-03-20",
    price: 449.99,
    rating: 4.7,
    description: "The Intel Core i7-12700K is a top-tier processor offering excellent performance for both gaming and content creation tasks. With its impressive balance of cores and threads, this processor ensures smooth multitasking and responsiveness. It features a base clock speed of 3.6GHz and a maximum turbo frequency of 5.0GHz, providing snappy performance in various applications. The Core i7-12700K is optimized for high-performance computing, making it an ideal choice for gamers and professionals alike. Whether you're editing videos, streaming, or playing the latest AAA games, this processor delivers a seamless and enjoyable user experience, making your computing tasks effortless and efficient.",
    type: "processor",
    photo: "https://media.istockphoto.com/id/1423747086/photo/intel-i5-12600k.webp?b=1&s=612x612&w=0&k=20&c=j30nFAndCtJoNJEw1TpFsId_UxfBzLihSyjI2-ZfUhk="
  },
  {
    name: "Intel SSD 670p",
    brand: "Intel",
    date: "2023-04-12",
    price: 129.99,
    rating: 4.6,
    description: "The Intel SSD 670p is a fast and reliable NVMe SSD designed for storage upgrades, enhancing the overall performance of your computer. With its impressive read and write speeds, this SSD significantly reduces loading times and improves system responsiveness. It offers ample storage capacity for your operating system, applications, and frequently accessed files. The Intel SSD 670p is also highly reliable, ensuring your data is safe and secure. Whether you're a gamer looking to reduce game loading times or a professional seeking faster workflow, this SSD is an excellent choice. Upgrade your system with the Intel SSD 670p and experience a significant boost in speed and efficiency.",
    type: "storage",
    photo: "intel_ssd_670p.jpg"
  },
  {
    name: "Intel NUC 11",
    brand: "Intel",
    date: "2023-01-30",
    price: 699.99,
    rating: 4.8,
    description: "The Intel NUC 11 is a compact and powerful mini PC that caters to various computing needs. Despite its small form factor, this mini PC packs a punch with its high-performance components. Powered by Intel's latest processors, it delivers excellent processing power for demanding tasks, making it ideal for both work and play. Whether you're a professional working on resource-intensive applications or a gamer diving into the latest games, the Intel NUC 11 can handle it all. Its compact size makes it perfect for space-constrained environments, and its portability ensures you can take your powerful computing setup wherever you go. Experience powerful performance without compromising on space with the Intel NUC 11.",
    type: "mini PC",
    photo: "https://media.istockphoto.com/id/621977854/photo/hard-disks-and-solid-state-sata-drives.webp?b=1&s=612x612&w=0&k=20&c=M0XyIEDUQz24rUEZAnmj0s8LPBqZ0YNLMcQLxCUsIXE="
  },
  {
    name: "ROG Phone 6",
    brand: "Asus",
    date: "2023-01-10",
    price: 899.99,
    rating: 4.7,
    description: "The Asus ROG Phone 6 is a gaming smartphone designed for gamers who demand the best in mobile gaming performance. With its high-refresh-rate display, this phone offers ultra-smooth visuals, ensuring a responsive and immersive gaming experience. It boasts powerful hardware, including a high-performance processor and a capable GPU, allowing you to play the latest games at maximum settings without lag or stuttering. The ROG Phone 6 also features advanced cooling solutions to keep the device thermally efficient during prolonged gaming sessions. Additionally, it offers a range of gaming-centric features, such as customizable buttons, gaming mode optimizations, and RGB lighting effects, enhancing your overall gaming experience. Dominate the gaming arena with the Asus ROG Phone 6.",
    type: "phone",
    photo: "https://cdn.pixabay.com/photo/2016/12/09/11/33/smartphone-1894723_640.jpg"
  },
  {
    name: "Asus ROG Strix Scar 17",
    brand: "Asus",
    date: "2023-02-28",
    price: 1799.99,
    rating: 4.8,
    description: "The Asus ROG Strix Scar 17 is a high-end gaming laptop tailored for gamers and content creators seeking uncompromised performance. Equipped with powerful graphics and a fast display, this laptop delivers stunning visuals and smooth gameplay. Its high-refresh-rate display ensures ultra-responsive gaming, providing a competitive edge in fast-paced games. The laptop's powerful graphics card enables high-quality rendering and supports real-time ray tracing, enhancing your gaming and creative experiences. With a customizable RGB keyboard, you can create a personalized gaming setup that matches your style. Additionally, the laptop features advanced cooling solutions to maintain optimal performance during intense gaming sessions. Experience top-tier gaming and content creation with the Asus ROG Strix Scar 17.",
    type: "laptop",
    photo: "https://media.istockphoto.com/id/1394988455/photo/laptop-with-a-blank-screen-on-a-white-background.webp?b=1&s=612x612&w=0&k=20&c=VCCVeK25QpSCdGjiDgeviwz2pJfikLyclwhX-MQblhg="
  },
  {
    name: "Asus TUF Gaming VG279QM",
    brand: "Asus",
    date: "2023-03-15",
    price: 399.99,
    rating: 4.6,
    description: "The Asus TUF Gaming VG279QM is a 27-inch gaming monitor designed for competitive gamers seeking a competitive edge. With its high refresh rate and low input lag, this monitor ensures ultra-smooth and responsive gameplay. It features a rapid refresh rate, reducing motion blur and providing clear visuals in fast-paced games. The low input lag minimizes the delay between your actions and on-screen response, enhancing your precision and timing in games. The monitor also supports adaptive sync technology, reducing screen tearing and stuttering, further improving your gaming experience. Its 27-inch display offers an immersive viewing experience, making you feel truly engaged in your games. Elevate your gaming setup with the Asus TUF Gaming VG279QM and enjoy fluid and responsive gameplay.",
    type: "monitor",
    photo: "https://cdn.pixabay.com/photo/2012/04/13/17/00/lcd-32872_640.png"
  },
  {
    name: "Asus ROG Claymore II",
    brand: "Asus",
    date: "2023-04-05",
    price: 199.99,
    rating: 4.7,
    description: "The Asus ROG Claymore II is a mechanical gaming keyboard that offers a premium typing and gaming experience. Featuring customizable RGB lighting, this keyboard allows you to personalize your setup with dynamic lighting effects and colors. Its mechanical switches provide tactile and audible feedback, ensuring a satisfying typing experience for both work and gaming. The keyboard also includes programmable keys, allowing you to create custom macros and shortcuts to streamline your workflow. With a durable construction, the ROG Claymore II is built to withstand intense gaming sessions and frequent use. Its detachable numpad provides flexibility in configuring your keyboard layout, adapting to various gaming and productivity needs. Enhance your gaming and typing experience with the Asus ROG Claymore II.",
    type: "keyboard",
    photo: "https://cdn.pixabay.com/photo/2015/05/26/23/52/technology-785742_640.jpg"
  },
  {
    name: "WH-1000XM4",
    brand: "Sony",
    date: "2023-03-28",
    price: 349.99,
    rating: 4.9,
    description: "The Sony WH-1000XM4 is a pair of premium noise-canceling headphones that deliver excellent sound quality and exceptional noise isolation. Featuring advanced noise-canceling technology, these headphones can effectively block out ambient noise, allowing you to fully immerse yourself in your music or calls. The headphones also offer adaptive sound control, adjusting the noise-canceling settings based on your activity and surroundings for a customized listening experience. With high-resolution audio support, the WH-1000XM4 delivers clear and detailed sound, bringing your music to life with exceptional clarity. Its comfortable design and long-lasting battery life make these headphones perfect for long flights, commutes, or extended listening sessions. Stay focused and enjoy your music in peace with the Sony WH-1000XM4.",
    type: "headphone",
    photo: "https://media.istockphoto.com/id/1325906677/photo/modern-design-of-black-color-wireless-earphone-isolated.webp?b=1&s=612x612&w=0&k=20&c=d4XpB0vQjh3Yx-9Ab0bOyYDmuDXUKduEwygr3PVX5nk="
  },
  {
    name: "Sony A7 IV",
    brand: "Sony",
    date: "2023-02-20",
    price: 2499.99,
    rating: 4.8,
    description: "The Sony A7 IV is a high-quality mirrorless camera designed for photographers and videographers seeking advanced features and exceptional image quality. Equipped with a full-frame sensor, this camera captures stunningly detailed and sharp photos, even in low-light conditions. It offers impressive autofocus capabilities, ensuring fast and accurate focus, whether you're capturing stills or recording videos. The camera supports 4K video recording, delivering high-resolution videos with vibrant colors and sharp details. With in-body image stabilization, the A7 IV minimizes camera shake, allowing you to capture sharp images and smooth videos without the need for a tripod. Its intuitive controls and customizable settings provide a seamless shooting experience, making it suitable for both professionals and enthusiasts. Capture your creative vision with the Sony A7 IV.",
    type: "camera",
    photo: "https://cdn.pixabay.com/photo/2013/11/28/10/02/camera-219958_640.jpg"
  },
  {
    name: "Sony X900H 4K TV",
    brand: "Sony",
    date: "2023-01-05",
    price: 1199.99,
    rating: 4.7,
    description: "The Sony X900H is a 4K HDR TV that offers excellent picture quality and smart features for an immersive entertainment experience. With its high-resolution display and HDR support, this TV delivers vibrant colors, deep blacks, and lifelike images, enhancing your viewing experience. It features advanced motion processing, reducing motion blur and ensuring smooth motion for fast-paced scenes and sports. The TV is equipped with smart features, allowing you to access popular streaming services, apps, and content with ease. Its intuitive interface and voice control capabilities make navigating and controlling your TV effortless. The Sony X900H also supports gaming consoles, offering low input lag and high refresh rates for a responsive and enjoyable gaming experience. Immerse yourself in stunning visuals and cinematic sound with the Sony X900H 4K TV.",
    type: "tv",
    photo: "https://media.istockphoto.com/id/486895337/photo/high-definition-television.webp?b=1&s=612x612&w=0&k=20&c=YxxDz_UBpte12KGVdYTrZIEH1WOtrkCMIxaZd1eK4JY="
  },
  {
    name: "Sony WH-XB900N",
    brand: "Sony",
    date: "2023-04-15",
    price: 199.99,
    rating: 4.6,
    description: "The Sony WH-XB900N is a pair of wireless headphones designed for audiophiles who crave powerful bass and immersive audio experiences. These headphones feature Extra Bass technology, delivering deep, punchy bass that enhances your music and movies. With active noise cancellation, they block out ambient noise, allowing you to enjoy your audio without distractions. The headphones offer a comfortable over-ear design and plush ear cushions, ensuring long listening sessions without discomfort. With touch controls, you can easily adjust volume, skip tracks, and answer calls with intuitive gestures. The headphones have a long battery life, providing hours of playback on a single charge. Whether you're a music enthusiast or a traveler, the Sony WH-XB900N offers a superior audio experience with impressive bass and noise cancellation capabilities.",
    type: "headphone",
    photo: "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg"
  }]
// mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wacbf1n.mongodb.net/?retryWrites=true&w=majority
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database Connected!");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const brandCollection = client.db("brandWebsite").collection("brandNames");
const ProductCollection = client.db("brandWebsite").collection("products");
const ProductCart = client.db("brandWebsite").collection("cart");



app.get("/", (req, res) => {
  res.send("brand server is running");
});


///getting brand names api
app.get("/brands", async (req, res) => {
  const cursor = brandCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});


///getting cart api
// app.get("/cart", async (req, res) => {
//   const cursor = ProductCart.find();
//   const result = await cursor.toArray();
//   res.send(result);
// });
app.get("/cart/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  console.log("cart query",query)
  const cursor =  ProductCart.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

///adding product api
app.post("/addtocart", async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  const result = await ProductCart.insertOne(newProduct);
  res.send(result);
});

///adding product to cart api
app.post("/addtoCart", async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  const result = await ProductCollection.insertOne(newProduct);
  res.send(result);
});

///getting specific brand products
app.get("/brandproducts/:type", async (req, res) => {
  const type = req.params.type;
  const query = { brand: type };
  const result = await ProductCollection.find(query);
  const Brandproducts = await result.toArray();
  res.send(Brandproducts);
});
///deleting product from cart api
app.delete("/cartproduct/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await ProductCart.deleteOne(query);
  res.send(result);
});
///loading specific product api
app.get("/specificProduct/:id", async (req, res) => {
  const id = req.params.id;

  console.log(" update id: ", id);
  const query = { _id: new ObjectId(id) };
  const result = await ProductCollection.findOne(query);
  console.log("to update result", result);
  res.send(result);
});

///updating a product
app.put("/updateproduct/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedProduct = req.body;
  console.log("from body update", updatedProduct);
  const newproduct = {
    name: updatedProduct.name,
    brand: updatedProduct.brand,
    date: updatedProduct.date,
    price: updatedProduct.price,
    rating: updatedProduct.rating,
    description: updatedProduct.description,
    type: updatedProduct.type,
    photo: updatedProduct.photo,
  };
  console.log("new product", newproduct);
  const product = {
    $set: {
      name: updatedProduct.name,
      brand: updatedProduct.brand,
      date: updatedProduct.date,
      price: updatedProduct.price,
      rating: updatedProduct.rating,
      description: updatedProduct.description,
      type: updatedProduct.type,
      photo: updatedProduct.photo,
    },
  };

  const result = await ProductCollection.updateOne(filter, product, options);
  console.log("updated obj", result);
  res.send(result);
});

// /adding all products

app.get('/addallproduct', async (req, res) => {
    const newProduct = products;
    console.log(newProduct);
    const options = { ordered: true };
    const result = await ProductCollection.insertMany(newProduct, options);
    if(result)
    console.log(" added succesfully");
    res.send(result);
})

app.listen(port, () => {
  console.log(
    `brand Server is running on port: ${port}, ${process.env.DB_USER},${process.env.DB_PASS} `
  );
});
