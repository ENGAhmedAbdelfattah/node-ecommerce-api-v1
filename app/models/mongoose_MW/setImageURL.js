const setImagesURL = (schema, folderName, ...imagefields) => {
  const creatImageURL = (doc) => {
    for (const image of imagefields) {
      if (typeof image === "string" && doc[image]) {
        doc[
          image
        ] = `${process.env.BASE_URL}/assets/${folderName}/${doc[image]}`;
      } else if (Array.isArray(image) === true && doc[image]) {
        const listImages = [];
        doc[imagefields].forEach((img) => {
          const imageURL = `${process.env.BASE_URL}/assets/${folderName}/${img}`;
          listImages.push(imageURL);
        });
        doc[imagefields] = listImages;
      }
    }
  };

  
  schema.post("init", (doc) => {
    creatImageURL(doc);
  });

  schema.post("save", (doc) => {
    creatImageURL(doc);
  });
};

module.exports = setImagesURL;
