import { projects } from "@/lib/portfolio";
import TiltCard from "@/components/marketing/TiltCard";
import Hero3D from "@/components/marketing/Hero3D";

export default function Home() {
  return (
    <>
      <header className="site-header fixed-top" id="siteHeader">
        <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
          <div className="container">
            <a className="brand" href="#home" aria-label="Aureus Technologies home">
              <img className="brand-logo" src="/images/aureus-technologies-logo.png" alt="" />
              <span className="brand-copy">
                <strong>AUREUS</strong>
                <small>TECHNOLOGIES</small>
              </span>
            </a>

            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-controls="mainNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item">
                  <a className="nav-link active" href="#home">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#services">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#portfolio">
                    Portfolio
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#process">
                    Process
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">
                    Contact
                  </a>
                </li>
                <li className="nav-item ms-lg-2">
                  <a className="nav-link nav-login-link" href="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Sign in
                  </a>
                </li>
                <li className="nav-item ms-lg-3">
                  <a className="btn-gold btn-small" href="#contact">
                    Get a Quote <i className="bi bi-arrow-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container position-relative">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="hero-copy reveal visible">
                  <p className="eyebrow-line">
                    IDEAS <i className="bi bi-dot"></i> TECHNOLOGY <i className="bi bi-dot"></i> REAL IMPACT
                  </p>
                  <h1>
                    Digital Solutions
                    <br />
                    <em>for a Digital Future</em>
                  </h1>
                  <p className="hero-lead">
                    We design and develop modern websites, software applications and digital experiences that
                    help businesses grow, automate and move with confidence.
                  </p>
                  <div className="hero-actions d-flex flex-column flex-sm-row gap-3">
                    <a className="btn-gold" href="#contact">
                      Start Your Project <i className="bi bi-arrow-right"></i>
                    </a>
                    <a className="btn-outline-gold" href="#portfolio">
                      Our Services
                    </a>
                  </div>
                  <div className="hero-stats">
                    <div>
                      <strong>Client-Focused</strong>
                      <small>Direct communication, always</small>
                    </div>
                    <div>
                      <strong>Modern &amp; Scalable</strong>
                      <small>Built with the right tools</small>
                    </div>
                    <div>
                      <strong>Sri Lanka &amp; Worldwide</strong>
                      <small>Wherever your business is</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-visual reveal visible">
                  <div className="hero-photo">
                    <Hero3D />
                    <div className="hero-side-caption">
                      <span>Technology</span>
                      <span>People</span>
                      <span>Progress</span>
                    </div>
                  </div>
                  <TiltCard className="device-mock device-mock-laptop" maxTilt={4} lift={0}>
                    <div className="device-screen">
                      <strong>Build</strong>
                      <strong>Innovate</strong>
                      <strong>Grow</strong>
                      <small>YOUR TECHNOLOGY PARTNER</small>
                    </div>
                    <div className="device-base"></div>
                  </TiltCard>
                  <div className="device-mock device-mock-phone">
                    <strong>Great Ideas</strong>
                    <strong>Better Solutions</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="section-heading text-center reveal">
              <p className="eyebrow justify-content-center">OUR SERVICES</p>
              <h2>
                What <em>We Do</em>
              </h2>
              <p>From idea to implementation, we provide end-to-end digital solutions for businesses of all sizes.</p>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-4 reveal">
                <TiltCard className="service-card h-100" maxTilt={5}>
                  <div className="service-icon">
                    <i className="bi bi-code-slash"></i>
                  </div>
                  <h3>Web Development</h3>
                  <p>Modern, responsive and scalable websites tailored to your business.</p>
                  <a className="service-link" href="#contact">
                    Learn More <i className="bi bi-arrow-right"></i>
                  </a>
                </TiltCard>
              </div>
              <div className="col-md-6 col-lg-4 reveal">
                <TiltCard className="service-card h-100" maxTilt={5}>
                  <div className="service-icon">
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3>Mobile App Development</h3>
                  <p>Powerful mobile applications for Android, iOS and cross-platform.</p>
                  <a className="service-link" href="#contact">
                    Learn More <i className="bi bi-arrow-right"></i>
                  </a>
                </TiltCard>
              </div>
              <div className="col-md-6 col-lg-4 reveal">
                <TiltCard className="service-card h-100" maxTilt={5}>
                  <div className="service-icon">
                    <i className="bi bi-cloud"></i>
                  </div>
                  <h3>Cloud &amp; Deployment</h3>
                  <p>Secure and scalable cloud infrastructure and deployment.</p>
                  <a className="service-link" href="#contact">
                    Learn More <i className="bi bi-arrow-right"></i>
                  </a>
                </TiltCard>
              </div>
              <div className="col-md-6 col-lg-4 reveal">
                <TiltCard className="service-card h-100" maxTilt={5}>
                  <div className="service-icon">
                    <i className="bi bi-layers"></i>
                  </div>
                  <h3>Business Systems</h3>
                  <p>Custom systems to automate and streamline your operations.</p>
                  <a className="service-link" href="#contact">
                    Learn More <i className="bi bi-arrow-right"></i>
                  </a>
                </TiltCard>
              </div>
              <div className="col-md-6 col-lg-4 reveal">
                <TiltCard className="service-card h-100" maxTilt={5}>
                  <div className="service-icon">
                    <i className="bi bi-bezier2"></i>
                  </div>
                  <h3>UI / UX Design</h3>
                  <p>Clear, thoughtful interfaces that make complex products feel simple.</p>
                  <a className="service-link" href="#contact">
                    Learn More <i className="bi bi-arrow-right"></i>
                  </a>
                </TiltCard>
              </div>
              <div className="col-md-6 col-lg-4 reveal">
                <TiltCard className="service-card h-100" maxTilt={5}>
                  <div className="service-icon">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <h3>IT Consulting</h3>
                  <p>Expert guidance to help you make the right technology decisions.</p>
                  <a className="service-link" href="#contact">
                    Learn More <i className="bi bi-arrow-right"></i>
                  </a>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 order-2 order-lg-1">
                <div className="about-visual-wrap reveal">
                  <TiltCard className="about-visual" maxTilt={6} lift={0}>
                    <img src="/images/aureus-technologies-logo.png" alt="Aureus Technologies logo" loading="lazy" />
                  </TiltCard>
                  <div className="about-stamp">
                    <strong>AT</strong>
                    <small>DESIGN • BUILD • EVOLVE</small>
                  </div>
                  <div className="quote-card">
                    <i className="bi bi-quote"></i>
                    <p>We’d rather build one thing properly than promise everything and deliver less.</p>
                    <small>— Aureus Technologies</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2">
                <div className="about-copy reveal">
                  <p className="eyebrow">WHY CHOOSE AUREUS</p>
                  <h2>
                    More Than Just <em>Technology</em>
                  </h2>
                  <p className="lead">
                    Aureus Technologies is a Sri Lanka-based software studio building websites, business systems
                    and mobile apps for clients who need things to actually work, not just look good.
                  </p>
                  <p>
                    We work directly with founders, small teams and growing businesses—with no account managers
                    or handoffs in between.
                  </p>
                  <ul className="about-checklist">
                    <li>
                      <i className="bi bi-check2"></i>Client-focused approach
                    </li>
                    <li>
                      <i className="bi bi-check2"></i>Modern and scalable technologies
                    </li>
                    <li>
                      <i className="bi bi-check2"></i>Reliable support and maintenance
                    </li>
                    <li>
                      <i className="bi bi-check2"></i>Passionate and experienced team
                    </li>
                  </ul>
                  <a className="btn-outline-gold" href="#contact">
                    Get In Touch <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section portfolio" id="portfolio">
          <div className="container">
            <div className="row align-items-end g-4 section-split reveal">
              <div className="col-lg-7">
                <p className="eyebrow">FEATURED WORK</p>
                <h2>
                  Our Recent <em>Projects</em>
                </h2>
              </div>
              <div className="col-lg-5">
                <p>
                  Concept case studies showing how we approach real problems—from workshop management software
                  to marketing sites built to convert visitors.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {projects.map((project) => (
                <div className="col-md-6" key={project.number}>
                  <TiltCard className="project-card h-100" maxTilt={3} lift={0}>
                    <div className={`project-visual${project.variant ? ` ${project.variant}` : ""}`}>
                      <span className="project-number">{project.number}</span>
                      <div className="mock-app">
                        <div className="mock-bar">
                          <i></i>
                          <i></i>
                          <i></i>
                        </div>
                        <div className="mock-body">
                          <aside>
                            <b>AT</b>
                            <span></span>
                            <span></span>
                            <span></span>
                          </aside>
                          <main>
                            <div className="mock-title"></div>
                            <div className="mock-stats">
                              <i></i>
                              <i></i>
                              <i></i>
                            </div>
                            <div className="mock-chart">
                              <b></b>
                              <b></b>
                              <b></b>
                              <b></b>
                              <b></b>
                              <b></b>
                            </div>
                          </main>
                        </div>
                      </div>
                    </div>
                    <div className="project-copy">
                      <small>{project.category}</small>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="tag-list">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <a href="#contact">
                        Discuss a similar project <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section process" id="process">
          <div className="container">
            <div className="section-heading text-center reveal">
              <p className="eyebrow justify-content-center">HOW WE WORK</p>
              <h2>
                From First Conversation <em>to Launch</em>
              </h2>
              <p>A transparent, collaborative process that keeps the project moving and you in the loop.</p>
            </div>
            <div className="row g-4 process-row">
              <div className="col-sm-6 col-lg-3 reveal">
                <article className="process-step">
                  <div className="step-number">01</div>
                  <h3>Discovery</h3>
                  <p>We define your goals, users, priorities and the business problem worth solving.</p>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3 reveal">
                <article className="process-step">
                  <div className="step-number">02</div>
                  <h3>Design</h3>
                  <p>We shape the structure and interface, then align every detail before the build.</p>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3 reveal">
                <article className="process-step">
                  <div className="step-number">03</div>
                  <h3>Development</h3>
                  <p>We turn the approved direction into a fast, reliable and responsive product.</p>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3 reveal">
                <article className="process-step">
                  <div className="step-number">04</div>
                  <h3>Launch &amp; Support</h3>
                  <p>We test, deploy and stay close as your solution moves into the real world.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="tech-band">
          <div className="container">
            <div className="row align-items-end g-4 mb-5 reveal">
              <div className="col-lg-7">
                <p className="eyebrow">OUR TOOLKIT</p>
                <h2>Technologies we work with</h2>
              </div>
              <div className="col-lg-5">
                <p className="mb-0">We choose the stack that makes sense for the product—not the other way around.</p>
              </div>
            </div>
            <div className="tech-grid reveal">
              <span><b>01</b>HTML5</span>
              <span><b>02</b>CSS3</span>
              <span><b>03</b>JavaScript</span>
              <span><b>04</b>Bootstrap</span>
              <span><b>05</b>Laravel</span>
              <span><b>06</b>PHP</span>
              <span><b>07</b>ASP.NET</span>
              <span><b>08</b>C#</span>
              <span><b>09</b>SQL Server</span>
              <span><b>10</b>MySQL</span>
              <span><b>11</b>Android</span>
              <span><b>12</b>Git</span>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="cta-band-glow">
            <Hero3D />
          </div>
          <div className="container position-relative text-center">
            <p className="eyebrow-line justify-content-center light">LET’S BUILD TOGETHER</p>
            <h2>
              Ready to Start Your Next <em>Project?</em>
            </h2>
            <p>Get in touch with us today and let’s turn your ideas into a working product.</p>
            <a className="btn-gold" href="#contact">
              Contact Us <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container position-relative">
            <div className="row g-5 align-items-start">
              <div className="col-lg-5">
                <div className="contact-copy reveal">
                  <p className="eyebrow">START A CONVERSATION</p>
                  <h2>
                    Have an idea?
                    <br />
                    <em>Let’s build it.</em>
                  </h2>
                  <p>
                    Tell us what you’re building and who it’s for. We’ll reply with next steps and a realistic
                    estimate—no generic sales pitch.
                  </p>
                  <div className="contact-note">
                    <i className="bi bi-stars"></i>
                    <p>
                      <strong>Every project is different.</strong>
                      <small>Share a few details and we’ll prepare a quotation shaped around your goals.</small>
                    </p>
                  </div>
                  <div className="contact-links">
                    <a className="contact-email" href="mailto:esmunasinghe@gmail.com">
                      <i className="bi bi-envelope"></i> esmunasinghe@gmail.com
                    </a>
                    <a
                      className="contact-email"
                      href="https://wa.me/94769049237?text=Hello%20Aureus%20Technologies%2C%20I%27d%20like%20to%20discuss%20a%20project."
                      target="_blank"
                      rel="noopener"
                    >
                      <i className="bi bi-whatsapp"></i> +94 76 904 9237
                    </a>
                  </div>
                  <small className="availability">Available for projects in Sri Lanka and worldwide</small>
                </div>
              </div>
              <div className="col-lg-7">
                <form className="contact-form reveal" id="contactForm">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label htmlFor="name">Your name *</label>
                      <input className="form-control" id="name" name="name" required placeholder="How should we address you?" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email">Email address *</label>
                      <input className="form-control" id="email" name="email" type="email" required placeholder="you@company.com" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone">Phone number</label>
                      <input className="form-control" id="phone" name="phone" type="tel" placeholder="+94" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="company">Company name</label>
                      <input className="form-control" id="company" name="company" placeholder="Your business or brand" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="service">Service required *</label>
                      <select className="form-select" id="service" name="service" required defaultValue="">
                        <option value="" disabled>
                          Select a service
                        </option>
                        <option>Website Development</option>
                        <option>Software Development</option>
                        <option>Mobile Application</option>
                        <option>UI/UX Design</option>
                        <option>Business System</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="budget">Project budget</label>
                      <select className="form-select" id="budget" name="budget" defaultValue="">
                        <option value="">Select a range</option>
                        <option>Under LKR 50,000</option>
                        <option>LKR 50,000 – 150,000</option>
                        <option>LKR 150,000 – 500,000</option>
                        <option>LKR 500,000+</option>
                        <option>Let’s discuss</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="message">Tell us about your project *</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="What are you building, who is it for, and what would success look like?"
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button className="btn-gold w-100 border-0" type="submit">
                        Send Project Inquiry <i className="bi bi-arrow-right"></i>
                      </button>
                      <p className="form-status mb-0" id="formStatus" aria-live="polite"></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row g-5 footer-main">
            <div className="col-lg-5">
              <a className="brand mb-4" href="#home" aria-label="Aureus Technologies home">
                <img className="brand-logo" src="/images/aureus-technologies-logo.png" alt="" />
                <span className="brand-copy">
                  <strong>AUREUS</strong>
                  <small>TECHNOLOGIES</small>
                </span>
              </a>
              <p>Websites, software and mobile apps for teams who need things to work.</p>
              <small>Based in Sri Lanka, working with clients worldwide.</small>
              <div className="footer-social">
                <a href="https://web.facebook.com/profile.php?id=61592797191408" target="_blank" rel="noopener" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://wa.me/94769049237" target="_blank" rel="noopener" aria-label="WhatsApp">
                  <i className="bi bi-whatsapp"></i>
                </a>
                <a href="mailto:esmunasinghe@gmail.com" aria-label="Email">
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg">
              <h3>Company</h3>
              <a href="#about">About</a>
              <a href="#portfolio">Our Work</a>
              <a href="#process">Process</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="col-6 col-md-4 col-lg">
              <h3>Services</h3>
              <a href="#services">Web Development</a>
              <a href="#services">Software Solutions</a>
              <a href="#services">Mobile Apps</a>
              <a href="#services">UI / UX</a>
            </div>
            <div className="col-12 col-md-4 col-lg">
              <h3>Get In Touch</h3>
              <a className="footer-contact-line" href="tel:+94769049237">
                <i className="bi bi-telephone"></i> +94 76 904 9237
              </a>
              <a className="footer-contact-line" href="mailto:esmunasinghe@gmail.com">
                <i className="bi bi-envelope"></i> esmunasinghe@gmail.com
              </a>
            </div>
          </div>
          <div className="footer-bottom d-flex flex-column flex-sm-row justify-content-between gap-2">
            <span>
              © <span id="year">2026</span> Aureus Technologies. All rights reserved.
            </span>
            <a href="#home">
              Back to top <i className="bi bi-arrow-up"></i>
            </a>
          </div>
        </div>
      </footer>

      <a
        className="whatsapp"
        href="https://wa.me/94769049237?text=Hello%20Aureus%20Technologies%2C%20I%27d%20like%20to%20discuss%20a%20project."
        target="_blank"
        rel="noopener"
        aria-label="Chat with Aureus Technologies on WhatsApp"
      >
        <i className="bi bi-whatsapp"></i>
        <span>Chat with us</span>
      </a>
    </>
  );
}
