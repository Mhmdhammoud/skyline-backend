/**
 * Runs recursively until in empties a given s3 directory.
 *
 * @param {S3} s3 - S3 Instance
 * @param {string} dir - S3 directory
 * @returns void
 *
 */
// import Keys from '../config/keys';
export const emptyS3Directory = async (s3, dir) => {
  const listParams = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: dir,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: process.env.BUCKET_NAME,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(s3, dir);
};
