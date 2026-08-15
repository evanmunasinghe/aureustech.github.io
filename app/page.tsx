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
        <section className="hero d-flex align-items-center" id="home">
          <div className="hero-grid-lines"></div>
          <div className="hero-orb"></div>
          <div className="container position-relative">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="hero-copy reveal visible">
                  <p className="eyebrow">
                    <span></span>AUREUS TECHNOLOGIES
                  </p>
                  <h1>
                    Building <em>smart solutions</em> for a digital future.
                  </h1>
                  <p className="hero-lead">
                    We design and develop modern websites, software applications and digital
                    experiences that help businesses grow, automate and move with confidence.
                  </p>
                  <div className="hero-actions d-flex flex-column flex-sm-row gap-3">
                    <a className="btn-gold" href="#contact">
                      Start Your Project <i className="bi bi-arrow-right"></i>
                    </a>
                    <a className="btn-outline-gold" href="#portfolio">
                      View Our Work
                    </a>
                  </div>
                  <div className="hero-tags d-flex flex-wrap">
                    <span>Web Development</span>
                    <span>Software Solutions</span>
                    <span>Mobile Apps</span>
                    <span>UI / UX</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-visual reveal visible">
                  <div className="hero-image">
                    <img src="/images/aureus-hero.png" alt="Modern technology workspace representing Aureus digital solutions" />
                  </div>
                  <div className="hero-promise">
                    <i className="bi bi-stars"></i>
                    <div>
                      <small>OUR PROMISE</small>
                      <strong>Ideas, engineered with purpose.</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="trust-strip row g-0">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-item">
                  <i className="bi bi-check2"></i>
                  <p>
                    <strong>Innovative Solutions</strong>
                    <small>Designed around you</small>
                  </p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-item">
                  <i className="bi bi-check2"></i>
                  <p>
                    <strong>Reliable Technology</strong>
                    <small>Built to perform</small>
                  </p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-item">
                  <i className="bi bi-check2"></i>
                  <p>
                    <strong>Scalable Systems</strong>
                    <small>Ready to grow</small>
                  </p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="trust-item border-0">
                  <i className="bi bi-check2"></i>
                  <p>
                    <strong>Client Focused</strong>
                    <small>Close collaboration</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="section-heading text-center reveal">
              <p className="eyebrow justify-content-center">
                <span></span>WHAT WE DO<span></span>
              </p>
              <h2>
                Digital capability, <em>built end to end.</em>
              </h2>
              <p>Everything you need to transform an ambitious idea into a polished, powerful digital solution.</p>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-xl-4 reveal">
                <article className="service-card h-100">
                  <div className="service-top">
                    <i className="bi bi-code-slash"></i>
                    <small>01</small>
                  </div>
                  <h3>Web Development</h3>
                  <p>Fast, responsive websites and web applications that sharpen your presence and turn visits into opportunities.</p>
                  <div className="tag-list">
                    <span>Company sites</span>
                    <span>E-commerce</span>
                    <span>Web apps</span>
                  </div>
                </article>
              </div>
              <div className="col-md-6 col-xl-4 reveal">
                <article className="service-card h-100">
                  <div className="service-top">
                    <i className="bi bi-layers"></i>
                    <small>02</small>
                  </div>
                  <h3>Software Solutions</h3>
                  <p>Purpose-built systems that streamline operations, reduce repetitive work and give your team room to grow.</p>
                  <div className="tag-list">
                    <span>Business systems</span>
                    <span>CRM</span>
                    <span>Dashboards</span>
                  </div>
                </article>
              </div>
              <div className="col-md-6 col-xl-4 reveal">
                <article className="service-card h-100">
                  <div className="service-top">
                    <i className="bi bi-phone"></i>
                    <small>03</small>
                  </div>
                  <h3>Mobile App Development</h3>
                  <p>Intuitive mobile experiences designed around real users, reliable performance and everyday ease.</p>
                  <div className="tag-list">
                    <span>Android</span>
                    <span>Cross-platform</span>
                    <span>Prototypes</span>
                  </div>
                </article>
              </div>
              <div className="col-md-6 col-xl-4 reveal">
                <article className="service-card h-100">
                  <div className="service-top">
                    <i className="bi bi-bezier2"></i>
                    <small>04</small>
                  </div>
                  <h3>UI / UX Design</h3>
                  <p>Clear, thoughtful interfaces that make complex products feel simple and every interaction feel considered.</p>
                  <div className="tag-list">
                    <span>Product UI</span>
                    <span>Wireframes</span>
                    <span>Design systems</span>
                  </div>
                </article>
              </div>
              <div className="col-md-6 col-xl-4 reveal">
                <article className="service-card h-100">
                  <div className="service-top">
                    <i className="bi bi-cloud"></i>
                    <small>05</small>
                  </div>
                  <h3>Cloud & Deployment</h3>
                  <p>Dependable deployment and hosting setups that keep your product secure, available and ready to scale.</p>
                  <div className="tag-list">
                    <span>Hosting</span>
                    <span>Deployment</span>
                    <span>Optimization</span>
                  </div>
                </article>
              </div>
              <div className="col-md-6 col-xl-4 reveal">
                <article className="service-card h-100">
                  <div className="service-top">
                    <i className="bi bi-graph-up-arrow"></i>
                    <small>06</small>
                  </div>
                  <h3>IT Consulting</h3>
                  <p>Practical technology guidance that helps you choose the right tools, roadmap and path forward.</p>
                  <div className="tag-list">
                    <span>Strategy</span>
                    <span>Architecture</span>
                    <span>Support</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 order-2 order-lg-1">
                <div className="about-visual reveal">
                  <img src="/images/aureus-technologies-logo.png" alt="Aureus Technologies logo" loading="lazy" />
                  <div className="about-stamp">
                    <strong>AT</strong>
                    <small>DESIGN • BUILD • EVOLVE</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2">
                <div className="about-copy reveal">
                  <p className="eyebrow">
                    <span></span>ABOUT AUREUS
                  </p>
                  <h2>
                    Technology built around <em>your vision.</em>
                  </h2>
                  <p className="lead">
                    Aureus Technologies is a software and digital solutions company focused on building modern, reliable
                    and user-friendly technology.
                  </p>
                  <p>
                    We work with individuals, startups and businesses to turn ideas into professional digital
                    products—from modern websites and management systems to mobile applications and custom software.
                  </p>
                  <blockquote>
                    <i className="bi bi-stars"></i>
                    <strong>Our mission is simple: turn ideas into powerful digital solutions.</strong>
                  </blockquote>
                  <div className="row g-4 about-values">
                    <div className="col-sm-6">
                      <div>
                        <i className="bi bi-check2"></i>
                        <p>
                          <strong>Modern Design</strong>
                          <small>Crafted for current expectations</small>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <i className="bi bi-check2"></i>
                        <p>
                          <strong>Custom Development</strong>
                          <small>Tailored to your requirements</small>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <i className="bi bi-check2"></i>
                        <p>
                          <strong>Responsive by Default</strong>
                          <small>Ready for every screen</small>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <i className="bi bi-check2"></i>
                        <p>
                          <strong>Long-Term Support</strong>
                          <small>Here beyond the launch</small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section portfolio" id="portfolio">
          <div className="container">
            <div className="row align-items-end g-4 section-split reveal">
              <div className="col-lg-7">
                <p className="eyebrow">
                  <span></span>SELECTED WORK
                </p>
                <h2>
                  Solutions that make <em>work feel simpler.</em>
                </h2>
              </div>
              <div className="col-lg-5">
                <p>
                  Demonstration concepts showing how we approach real business challenges with clarity, care and
                  measurable purpose.
                </p>
              </div>
            </div>

            <div className="projects">
              <article className="project-card reveal">
                <div className="row g-0">
                  <div className="col-lg-7">
                    <div className="project-visual">
                      <span className="project-number">01</span>
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
                  </div>
                  <div className="col-lg-5 d-flex">
                    <div className="project-copy">
                      <small>BUSINESS MANAGEMENT SYSTEM</small>
                      <h3>FLEEVE Garage Platform</h3>
                      <p>A unified workshop workspace for customers, vehicles, job cards, technicians, inspections and bookings.</p>
                      <div className="tag-list">
                        <span>Laravel</span>
                        <span>MySQL</span>
                        <span>JavaScript</span>
                      </div>
                      <a href="#contact">
                        Discuss a similar project <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </article>

              <article className="project-card reveal">
                <div className="row g-0">
                  <div className="col-lg-7">
                    <div className="project-visual blue">
                      <span className="project-number">02</span>
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
                  </div>
                  <div className="col-lg-5 d-flex">
                    <div className="project-copy">
                      <small>WEB DESIGN & DEVELOPMENT</small>
                      <h3>Corporate Digital Presence</h3>
                      <p>A polished, conversion-focused company website built to communicate value and invite customer action.</p>
                      <div className="tag-list">
                        <span>Responsive UI</span>
                        <span>Performance</span>
                        <span>SEO</span>
                      </div>
                      <a href="#contact">
                        Discuss a similar project <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section process" id="process">
          <div className="container">
            <div className="section-heading text-center reveal">
              <p className="eyebrow justify-content-center">
                <span></span>HOW WE WORK<span></span>
              </p>
              <h2>
                From first conversation <em>to launch.</em>
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
                  <h3>Launch & Support</h3>
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
                <p className="eyebrow">
                  <span></span>OUR TOOLKIT
                </p>
                <h2>Technologies we work with</h2>
              </div>
              <div className="col-lg-5">
                <p className="mb-0">We choose the stack that makes sense for the product—not the other way around.</p>
              </div>
            </div>
            <div className="tech-grid reveal">
              <span>
                <b>01</b>HTML5
              </span>
              <span>
                <b>02</b>CSS3
              </span>
              <span>
                <b>03</b>JavaScript
              </span>
              <span>
                <b>04</b>Bootstrap
              </span>
              <span>
                <b>05</b>Laravel
              </span>
              <span>
                <b>06</b>PHP
              </span>
              <span>
                <b>07</b>ASP.NET
              </span>
              <span>
                <b>08</b>C#
              </span>
              <span>
                <b>09</b>SQL Server
              </span>
              <span>
                <b>10</b>MySQL
              </span>
              <span>
                <b>11</b>Android
              </span>
              <span>
                <b>12</b>Git
              </span>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-orb"></div>
          <div className="container position-relative">
            <div className="row g-5 align-items-start">
              <div className="col-lg-5">
                <div className="contact-copy reveal">
                  <p className="eyebrow">
                    <span></span>START A CONVERSATION
                  </p>
                  <h2>
                    Have an idea?
                    <br />
                    <em>Let’s build it.</em>
                  </h2>
                  <p>
                    Tell us what you’re imagining. We’ll help you find the clearest path from concept to a professional
                    digital solution.
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
              <p>Building smart solutions for a digital future.</p>
              <small>Turning ideas into powerful digital solutions.</small>
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
              <h3>Connect</h3>
              <a href="https://web.facebook.com/profile.php?id=61592797191408" target="_blank" rel="noopener">
                Facebook
              </a>
              <a href="https://wa.me/94769049237" target="_blank" rel="noopener">
                WhatsApp
              </a>
              <a href="mailto:esmunasinghe@gmail.com">Email</a>
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
