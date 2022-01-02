store:{

    user:{
      name,
      uid,
      email,
      photoURL,
      [owned templates],
      number of issued certificates,
    },

    templates:{
      userTemplates:[
        {
          id,
          ownerId,
          name,
          description,
          imageURL,
        }
        ...
      ],
      
      currentTemplate:{
          id,
          canvas:{
              activeItem: { ...activeItem},
              isBaseImageLoaded:false,
              otherImagesLoaded:false,
              ratio:{x: x, y: y }(default base image ratio),
              imageReferences:{
                  baseImage: baseImage/path 
                  images: [
                      {
                        image1_name: ref/path/
                      },
                      {
                        image2_name:ref/path/
                      }
                    ]
              },
              items:[
                    image:{
                      name
                      id,
                      x,
                      y,
                      src,
                      {...konva img attributes},
                    },
                    text:{
                      id,
                      value/name,
                      x,
                      y,
                      fontSize,
                      {...konva text attributes}
                    }
              ],
              
              stageRef,
              
          },
      }
    }


}

----------------------------------------------------------------------------------------------------

firestore:
Doc: templates:{
  id,
  name,
  ownerId,
  template Example Image Reference,
  exportCertificateAs: image (or) pdf
  canvas:{
      ratio:{x: x, y: y},
      imageReferences:{
          baseImage,
          images:[
            {...images}
          ]
      },
      baseImageHeight,
      baseImageWidth,
      items:[
        ...konva items with all defined and default attributes
      ],
  }
}

Doc: certificates{
    id,
    receiverEmail,
    issuedBy,
    templateId,
    issuedOn,
    ValidTill,
    fields:{
      ...fields
    },
    image.pdf/path
}

Doc: admins{,
  uid,
  photoURL,
  name,
  email,
  noOfCertificatesIssues,
  templates:[...template ids],
  ...billing
}

