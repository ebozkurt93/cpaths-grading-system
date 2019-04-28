import React, { useState } from 'react';
import Link from 'next/link';
import RequestEditInitialForm from '../components/RequestEditInitialForm';
import Modal from '../components/Modal';
import { enableApplications } from '../config';

const HomePage = props => {
  const [edit, setEdit] = useState(props.query.update ? true : false);
  const [showDetails, setShowDetails] = useState(false);

  const center = { textAlign: 'center' };
  const italic = { fontStyle: 'italic' };

  const topContent = (
    <>
      <a target='_blank' href='http://kesisenyollar.org/'>
        <img
          src='../static/kyollar_logo.svg'
          style={{ display: 'block', margin: 'auto', maxWidth: '10rem' }}
        />
      </a>
      <br />
      <h2 style={center}>Kesişen Yollar Yurt Dışında Staj Programı</h2>
    </>
  );

  const details = (
    <>
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
    </>
  );
  const whileTakingApplicationsContent = (
    <>
      {topContent}
      {details}
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

  const afterTakingApplicationsContent = (
    <>
      {topContent}
      <br />
      <br />
      <p>
        <b>
          Yoğun ilginiz için çok teşekkür ederiz! Yurt Dışında Staj Programı
          2019 program başvuruları sona erdi.
        </b>{' '}
        Sonuçlar 31 Mayıs tarihinde bu sayfadan ve sosyal medya hesaplarımızdan
        duyurulacak! Bizi{' '}
        <a target='_blank' href='https://www.facebook.com/KesisenYollarDernegi'>
          Facebook sayfamızdan
        </a>
        {' ve '}
        <a
          target='_blank'
          href='https://www.instagram.com/kesisenyollardernegi'
        >
          Instagram hesabımızdan
        </a>{' '}
        takip edebilirsin!{' '}
      </p>
      <p>
        Program hakkında detaylı bilgiye{' '}
        <a
          href=''
          onClick={e => {
            e.preventDefault();
            setShowDetails(true);
          }}
        >
          buradan
        </a>{' '}
        ulaşabilirsin!
      </p>
      <p>
        Yurt dışında staj bursunu bırakın da, stajı bulmak asıl işin en zor
        kısmı mı diyorsun? Gerçekten de haklısın :) Belki geçmiş senelerdeki
        bursiyerlerimizin{' '}
        <a target='_blank' href='https://kesisenyollar.org/basari-oykuleri'>
          hikayelerinden
        </a>{' '}
        ilham alarak sürece başlayabilirsin. Ayrıca, istersen{' '}
        <a
          target='_blank'
          href='https://kesisenyollar.org/programlar/danismanlik'
        >
          danışmanlık programımıza
        </a>{' '}
        dahil olup danışmanlarımızla bire bir görüşmeler ayarlayarak yaz
        hedeflerini somutlaştırmaya yönelik ilk adımları atabilirsin!
      </p>
      <p>
        Master & Ph.D. hedeflerine yönelik kendini geliştirmek için araştırma
        stajı mı yapmak istiyorsun? Amerika'daki bazı üniversitelerde sana burs
        veren çeşitli bölümlere yönelik araştırma staj programları olduğunu
        biliyor muydun? Bir kısmına göz atmak için buraya{' '}
        <a
          target='_blank'
          href='https://kesisenyollar.org/universite-arastirma-programlari'
        >
          tıkla
        </a>
        .
      </p>
      <p>
        Bilgisayar mühendisliği veya yakın bölümlerden birinde okuyorsun ve
        global dev şirketlerde veya bir Startup'ta staj mı yapmak istiyorsun? Bu
        yollardan başarıyla geçmiş kişilerin hikayeleri (Miraç-Google &
        Hikmet-Startup) ve daha fazlası için{' '}
        <a target='_blank' href='https://medium.com/kesisenyollardernegi'>
          Medium sayfamıza
        </a>{' '}
        mutlaka göz at!
      </p>
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
      {!enableApplications && (
        <>
          {afterTakingApplicationsContent}
          {showDetails && (
            <Modal
              title='Kesişen Yollar Yurt Dışında Staj Programı
 Detayları'
              closeModal={() => setShowDetails(false)}
            >
              {details}
            </Modal>
          )}
        </>
      )}
      {enableApplications && (
        <>
          {whileTakingApplicationsContent}
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
        </>
      )}
    </div>
  );
};

export default HomePage;
