import './index.css'
import LogoJS from './JS.png'
import LogoHTML from './HTML.png'
import LogoCSS from './CSS.png'
import logoReact from './React.png'
import logoRedux from './Redux.png'

import logoNode from './NodeJS.png';
import logoExpress from './ExpressJS.png';
import logoPostgre from './PostgreSQL.png';
import logoSeq  from './Sequelize.png';
import logoPostman from './Postman.png';

import logoTest from './QA.png';
import logoGitHub from './GitHub.png';
import logoSCRUM from './SCRUM.png'

import ingeniero from './NotJustaProgrammer.png'
import profe from './Teacher.png'

export default function index(){
    return(
        <div className="aboutBody">
            <h1>About Me</h1>
            <div className="content">
                <h3>Software Skills</h3>
                I am a happy graduated from <b>Full Stack Developer Intensive Bootcamp</b> at soyHenry.
                <br/>There were more than 700 hours of programming based on practice and real projects.
                <br/>
                <br/>I have experience with:
                <br/>
                <h2><u>FrontEnd</u></h2>
                <div className="skills">
                    <div className="skillLogoFrame"><img className="skillLogo" src={LogoJS}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={LogoHTML}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={LogoCSS}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoReact}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoRedux}/></div>

                    <div className="skillName"><b>JavaScript</b></div>
                    <div className="skillName"><b>HTML</b></div>
                    <div className="skillName"><b>CSS</b></div>
                    <div className="skillName"><b>ReactJS</b></div>
                    <div className="skillName"><b>Redux</b></div>
                </div>

                <br/>
                <h2><u>Backend</u></h2>
                <div className="skills">
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoNode}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoExpress}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoPostgre}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoSeq}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoPostman}/></div>

                    <div className="skillName"><b>NodeJS</b></div>
                    <div className="skillName"><b>ExpressJS</b></div>
                    <div className="skillName"><b>PostgreSQL</b></div>
                    <div className="skillName"><b>Sequelize</b></div>
                    <div className="skillName"><b>Postman</b></div>
                </div>

                <br/>
                <h2><u>Other Skills</u></h2>
                <div className="otherSkills">
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoTest}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoGitHub}/></div>
                    <div className="skillLogoFrame"><img className="skillLogo" src={logoSCRUM}/></div>

                    <div className="skillName"><b>Testing</b></div>
                    <div className="skillName"><b>GitHub</b></div>
                    <div className="skillName"><b>SCRUM</b></div>
                </div>

                <br/>
                <br/>

                <div className="otherProfessions">
                    <div className="otherProfession">
                        <img className="otherProf" src={ingeniero}/>
                        <div>
                            <h3>Industrial Engineer</h3>
                            I am also an <b>Industrial Engineer</b> graduated on 2011.
                            <br/>As such, I've been in the <b>user</b> place many times, so I capitalize that experience in order to give a good User Experience.
                        </div>
                    </div>
                    <div className="otherProfession">
                        <img className="otherProf" src={profe}/>
                        <div>
                            <h3>Highschool Teacher</h3>
                            I am also an exact sciences <b>Highschool Techer</b>.
                            <br/>As such, I've been trained in <b>communication skills</b> and <b>explaining</b> new themes, also recently learned ones.
                        </div>
                    </div>

                </div>


            </div>
            <div className="homeFoot">That´s all in this tab, go see the next!</div>
        </div>
    )
}