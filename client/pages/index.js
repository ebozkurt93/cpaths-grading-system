import React, { useState } from 'react';
import Link from 'next/link';
import RequestEditInitialForm from '../components/RequestEditInitialForm';
import Modal from '../components/Modal';
const HomePage = props => {
  const [edit, setEdit] = useState(false);

  const center = { textAlign: 'center' };
  const italic = { fontStyle: 'italic' };

  const content = (
    <>
      <a target='_blank' href='http://kesisenyollar.org/'>
        <img
          src='../static/logo.png'
          style={{ display: 'block', margin: 'auto', maxWidth: '15rem' }}
        />
      </a>
      <br />
      <h2 style={center}>Kesişen Yollar Yurt Dışında Staj Programı</h2>
      <p>
        Yurt dışında staj programı, hali hazırda yurt dışında staj bulmuş
        öğrencilere maddi destek sağlayan bir burs programıdır.
      </p>
      <h3 style={center}>Kimler başvurabilir?</h3>
      <ul>
        <li>
          Türkiye’de bir üniversiteye kayıtlı olan ve 2019-20 döneminde
          üniversite öğrencisi olmaya devam edecek
        </li>
        <li>3.00 üzerinde CGPA’ye sahip</li>
        <li>Staj programı dahilinde ödeme almayan</li>
        <li>
          En az 1 ay süreli yurt dışı staj başvurusu onaylanmış öğrenciler
          programa başvurabilir.
        </li>
        <li>
          Ayrıca, Yurt Dışı Staj Bursu Programı jürisinde ve yönetim kurulunda
          yer almayan, veya onların birinci dereceden yakını olmayan Kesişen
          Yollar gönüllüleri ve kampüs temsilcileri de bu programa başvurabilir.
        </li>
      </ul>
      <h3 style={center}>Hangi kapsamdaki staj programlarını destekliyoruz?</h3>
      <ul>
        <li>Kurumsal şirketler</li>
        <li>Startup'lar</li>
        <li>Üniversiteler veya araştırma kuruluşları</li>
      </ul>
      <h3 style={center}>Nasıl bir maddi destek sağlıyoruz?</h3>
      <ul>
        <li>
          Programımız gidiş-dönüş uçak biletini (max. 500$a kadar)
          karşılamaktadır.
        </li>
      </ul>
      <p style={italic}>
        Aklına bir soru mu takıldı? Sıkça sorulan sorular için{' '}
        <a target='_blank' href='https://kesisenyollar.org/sss/#staj-sss'>
          buraya tıkla
        </a>
        . Eğer soruna cevap bulamadıysan,{' '}
        <a href='mailto:staj@cpaths.org'>staj@cpaths.org</a>'a mail atarak bize
        ulaşabilirsin.
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Link href='/apply'>
          <a className='btn btn-primary btn-lg'>HEMEN BAŞVUR</a>
        </Link>
      </div>
    </>
  );
  const wantToEdit = (
    <>
      <p style={{ ...italic, marginBottom: '0' }}>
        Başvurunu yaptın fakat üzerinde değişiklik mi yapmak istiyorsun?
        Başvurunu güncellemek için{' '}
        <a
          href=''
          onClick={e => {
            e.preventDefault();
            setEdit(true);
          }}
        >
          buraya tıkla
        </a>
        .
      </p>
    </>
  );
  return (
    <div
      className='col-8 col-mx-auto bg-gray'
      style={{
        maxWidth: '800px',
        padding: '10px 10px'
      }}
    >
      {content}
      <br />
      <hr />
      <br />
      {wantToEdit}
      {edit ? (
        <Modal title='' closeModal={() => setEdit(false)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <RequestEditInitialForm />
          </div>
        </Modal>
      ) : (
        ''
      )}
    </div>
  );
};

export default HomePage;
