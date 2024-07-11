(function() {
  "use strict";
  const UPLOAD_CLOUDFRONT_URL = "https://d3gzte3zjbip1z.cloudfront.net";
  const splitArray = (array, groupSize) => {
    var sets = [];
    for (let i = 0, j = 0; j < array.length; i++, j += groupSize) {
      sets[i] = array.slice(j, j + groupSize);
    }
    return sets;
  };
  let noGifTopFrameImages;
  let MB_noGifTopFrameImages;
  let topFrameImages;
  let MB_topFrameImages;
  let pluginFileKey;
  let linkFileId;
  let MB_linkFileId;
  let thumbnail;
  let featAccessToken;
  self.onmessage = ({ data }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    console.log("data from onmessage", data);
    if ((data == null ? void 0 : data.action) === "uploadNoGif") {
      noGifTopFrameImages = (_a = data == null ? void 0 : data.payload) == null ? void 0 : _a.noGifTopFrameImages;
      pluginFileKey = (_b = data == null ? void 0 : data.payload) == null ? void 0 : _b.pluginFileKey;
      linkFileId = (_c = data == null ? void 0 : data.payload) == null ? void 0 : _c.linkFileId;
      featAccessToken = (_d = data == null ? void 0 : data.payload) == null ? void 0 : _d.featAccessToken;
      MB_linkFileId = (_e = data == null ? void 0 : data.payload) == null ? void 0 : _e.MB_linkFileId;
      MB_noGifTopFrameImages = (_f = data == null ? void 0 : data.payload) == null ? void 0 : _f.MB_noGifTopFrameImages;
      (async () => {
        await uploadNoGifPages(linkFileId, noGifTopFrameImages);
        if ((MB_linkFileId == null ? void 0 : MB_linkFileId.length) && (MB_noGifTopFrameImages == null ? void 0 : MB_noGifTopFrameImages.length)) {
          await uploadNoGifPages(MB_linkFileId, MB_noGifTopFrameImages);
        }
        self.postMessage({
          action: "uploadNoGifDone"
        });
      })();
    }
    if ((data == null ? void 0 : data.action) === "uploadTopFrame") {
      topFrameImages = (_g = data == null ? void 0 : data.payload) == null ? void 0 : _g.topFrameImages;
      MB_topFrameImages = (_h = data == null ? void 0 : data.payload) == null ? void 0 : _h.MB_topFrameImages;
      pluginFileKey = (_i = data == null ? void 0 : data.payload) == null ? void 0 : _i.pluginFileKey;
      linkFileId = (_j = data == null ? void 0 : data.payload) == null ? void 0 : _j.linkFileId;
      featAccessToken = (_k = data == null ? void 0 : data.payload) == null ? void 0 : _k.featAccessToken;
      MB_linkFileId = (_l = data == null ? void 0 : data.payload) == null ? void 0 : _l.MB_linkFileId;
      (async () => {
        await uploadPages(linkFileId, topFrameImages);
        if ((MB_linkFileId == null ? void 0 : MB_linkFileId.length) && (MB_topFrameImages == null ? void 0 : MB_topFrameImages.length)) {
          await uploadPages(MB_linkFileId, MB_topFrameImages, false);
        }
        self.postMessage({
          action: "uploadTopFrameDone",
          thumbnail
        });
      })();
    }
  };
  const bufferToBlob = (buffer) => {
    return new Blob([buffer]);
  };
  const parallelPageImagesUpload = async (i, pageImagePresignedUrl, noGifTopFrameImages2) => {
    const page = Number(i);
    const pngBuffer = noGifTopFrameImages2[page];
    const pngBlob = bufferToBlob(pngBuffer);
    pageImagePresignedUrl == null ? void 0 : pageImagePresignedUrl.url;
    const s3Fields = pageImagePresignedUrl == null ? void 0 : pageImagePresignedUrl.fields;
    const s3FormData = new FormData();
    for (const [key, value] of Object.entries(s3Fields)) {
      s3FormData.append(key, value);
    }
    s3FormData.append("file", pngBlob, `${pluginFileKey}-${page + 1}.png`);
    const s3Res = await fetch(UPLOAD_CLOUDFRONT_URL, {
      method: "POST",
      body: s3FormData
    });
    const s3Result = await s3Res.text();
    console.log("s3 upload page complete", page + 1, "page", s3Result);
  };
  const parallelPageThumbnailsUpload = async (i, motionThumbnailPresignedUrl, topFrameImages2, updateThumbnail = true) => {
    const page = Number(i);
    const thumbnailBuffer = topFrameImages2[page];
    const thumbnailBlob = bufferToBlob(thumbnailBuffer);
    motionThumbnailPresignedUrl == null ? void 0 : motionThumbnailPresignedUrl.url;
    const t_s3Fields = motionThumbnailPresignedUrl == null ? void 0 : motionThumbnailPresignedUrl.fields;
    const t_s3FormData = new FormData();
    for (const [key, value] of Object.entries(t_s3Fields)) {
      t_s3FormData.append(key, value);
      if (updateThumbnail && key === "key" && page === 0) {
        thumbnail = value;
      }
    }
    t_s3FormData.append(
      "file",
      thumbnailBlob,
      `${pluginFileKey}-${page + 1}.png`
    );
    const t_s3Res = await fetch(UPLOAD_CLOUDFRONT_URL, {
      method: "POST",
      body: t_s3FormData
    });
    const t_s3Result = await t_s3Res.text();
    console.log("s3 thumbnail upload complete", page + 1, "page", t_s3Result);
  };
  const uploadPages = async (fileId, topFrameImages2, updateThumbnail = true) => {
    const splitedTopFrameImages = splitArray(topFrameImages2, 5);
    const motionThumbnailUploadRes = await fetch(
      `${"https://staging.featpaper.com"}${"/api/ext/figma"}/file/${fileId}/make-presigned?type=page-thumbnail&numPages=${topFrameImages2.length}&mimeType=image%2Fjpeg`,
      {
        headers: {
          Authorization: "Bearer " + featAccessToken
        }
      }
    );
    const motionThumbnailResJson = await motionThumbnailUploadRes.json();
    try {
      for (let i in splitedTopFrameImages) {
        await Promise.all(
          splitedTopFrameImages[i].map(async (_el, index) => {
            return new Promise((resolve, reject) => {
              (async () => {
                try {
                  await parallelPageThumbnailsUpload(
                    Number(i) * 5 + index,
                    motionThumbnailResJson.data[Number(i) * 5 + index],
                    topFrameImages2,
                    updateThumbnail
                  );
                  resolve();
                } catch (e) {
                  console.error(e);
                  reject(e);
                }
              })();
            });
          })
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const uploadNoGifPages = async (fileId, noGifTopFrameImages2) => {
    const splitedNoGifTopFrameImages = splitArray(noGifTopFrameImages2, 5);
    const motionPageUploadRes = await fetch(
      `${"https://staging.featpaper.com"}${"/api/ext/figma"}/file/${fileId}/make-presigned?type=page&numPages=${noGifTopFrameImages2.length}&mimeType=image%2Fjpeg`,
      {
        headers: {
          Authorization: "Bearer " + featAccessToken
        }
      }
    );
    const pageUploadResJson = await motionPageUploadRes.json();
    try {
      for (let i in splitedNoGifTopFrameImages) {
        await Promise.all(
          splitedNoGifTopFrameImages[i].map(async (_el, index) => {
            return new Promise((resolve, reject) => {
              (async () => {
                try {
                  await parallelPageImagesUpload(
                    Number(i) * 5 + index,
                    pageUploadResJson.data[Number(i) * 5 + index],
                    noGifTopFrameImages2
                  );
                  console.log(
                    "ok, no gif upload done...",
                    splitedNoGifTopFrameImages,
                    i,
                    index
                  );
                  resolve();
                } catch (e) {
                  console.error(e);
                  reject(e);
                }
              })();
            });
          })
        );
      }
    } catch (e) {
      throw e;
    }
  };
})();
