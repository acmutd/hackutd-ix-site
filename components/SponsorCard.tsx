import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import LoadIcon from './LoadIcon';
import Image from 'next/image';

interface SponsorCardProps {
  link: string;
  reference: string;
}

/**
 * Keynote Speaker card for landing page.
 */
export default function SponsorCard(props: SponsorCardProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageRef = firebase.storage().ref();

    storageRef
      .child(props.reference)
      .getDownloadURL()
      .then((url) => {
        setImgSrc(url);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadIcon width={100} height={100} />;

  return (
    <div className="flex w-[27rem] h-[9rem] md:mr-20 mr-16 my-4">
      <a href={props.link}>
        <Image src={imgSrc} width="100%" />
      </a>
      <br></br>
    </div>
  );
}
