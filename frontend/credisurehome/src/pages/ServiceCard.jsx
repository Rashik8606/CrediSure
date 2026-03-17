import { useEffect, useRef, useState } from "react"
import '../css/serviceCard.css'




const SERVICES = [
    {
        logo : 'CREDISURE 1',
        logoColor : '#FF9900',
        title : 'Amazon UI Management',
        titleBlue : true,
        desc : 'Full-service Amazon management across EU5 and beyond. Listing optimization, A+ Content, PPC advertising, and Brand Store development.',
        link : '#'

    },
    {
        logo : 'CREDISURE 2',
        logoColor : '#FF9900',
        title : 'Amazon UI Management',
        titleBlue : true,
        desc : 'Full-service Amazon management across EU5 and beyond. Listing optimization, A+ Content, PPC advertising, and Brand Store development.',
        link : '#'

    },
    {
        logo : 'CREDISURE 3',
        logoColor : '#FF9900',
        title : 'Amazon UI Management',
        titleBlue : true,
        desc : 'Full-service Amazon management across EU5 and beyond. Listing optimization, A+ Content, PPC advertising, and Brand Store development.',
        link : '#'

    },
    // {
    //     logo : 'CREDISURE 4',
    //     logoColor : '#FF9900',
    //     title : 'Amazon UI Management',
    //     titleBlue : true,
    //     desc : 'Full-service Amazon management across EU5 and beyond. Listing optimization, A+ Content, PPC advertising, and Brand Store development.',
    //     link : '#'

    // }
]


function useInView(threshold = 0.15){
    const ref = useRef(null)
    const [visible, setVisible ] = useState(false)

    useEffect(()=>{
        const observe = new IntersectionObserver(
            ([entry])=>{
                if(entry.isIntersecting){
                    setVisible(true)
                    observe.disconnect()
                }
            },
            { threshold }
        )
        if(ref.current) observe.observe(ref.current)
            return ()=> observe.disconnect()
    },[threshold])

    return [ref, visible]
}

function ServiceCard({logo, logoColor, title, titleBlue, desc , link}){
    const [ref, visible] = useInView()
    

    return (
        <div ref={ref} className={`service-card ${visible ? 'in-view' : ''}`}>
            <div className="card-top">
                <div className="card-logo" style={{color:logoColor}}>{logo}</div>
                <h3 className={`card-title ${titleBlue ? 'blue': ''}`}>{title}</h3>
            </div>
            <p className="card-desc">{desc}</p>
            <a className="card-link" href={link}>Learn More</a>
        </div>
    )
}

export default function ServiceSection () {
    const [headerRef, headerVisible] = useInView()
    const [darkMode, setDarkMode ] = useState(()=>{
        const saved = localStorage.getItem('bp-theme')
        return saved ? saved === 'dark' : true
    })

    useEffect(()=>{
        document.body.classList.toggle('dark',darkMode)
        localStorage.setItem('bp-theme',darkMode ? 'dark':'light')
    }, [darkMode])

    const toggleTheme = ()=>{
        setDarkMode(prev => !prev)
    }

    return(
        <section className="services-section">
      <div className="services-inner">
 
        {/* Header */}
        <div ref={headerRef} className={`services-header ${headerVisible ? 'in-view' : ''}`}>
          <p className="services-eyebrow">Services</p>
          <h2 className="services-title">What we do</h2>
          <p className="services-desc">
            Integrated European commerce — marketplaces, D2C, and creative working together.
          </p>
        </div>
 
        {/* Cards Grid */}
        <div className="services-grid">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
 
      </div>
    </section>
    )
}
