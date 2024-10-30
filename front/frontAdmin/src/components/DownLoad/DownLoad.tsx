const useFetch = async (url: string) => {
  const res = await fetch(url).then((res) => res.arrayBuffer());
  console.log(res);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([res], {
      // type:"image/png"
    }),
  );
  a.download = 'xiaman.zip';
  a.click();
};

const download = () => {
  useFetch('/api/download/stream');
};
const DownLoadComponent = () => {
  return (
    <>
      <div onClick={download} style={{ cursor: 'pointer'}}>下载</div>
    </>
  );
};

export default DownLoadComponent;