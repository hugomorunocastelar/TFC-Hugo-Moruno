import React from "react";
import "./PrivacyPolicy.css";
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
    const navigate = useNavigate();


    return (
        <div className="privacy-policy-container">
            <main className="privacy-main">
                <header>
                    <div className="privacy-title">
                        <h1>Privacy Policy — Dot&amp;Dot</h1>
                        <button onClick={() => {navigate("/")}}>Back</button>
                    </div>
                    <p className="privacy-updated">
                        Last updated: November 19, 2025
                    </p>
                </header>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        At Dot&amp;Dot (hereinafter, "Dot&amp;Dot", "we" or "the Company") we are
                        aware of the importance of protecting the privacy and personal data
                        of the people with whom we interact. This Privacy Policy
                        describes how we collect, use, store, protect and disclose
                        personal data in compliance with applicable data protection regulations
                        in Spain (LOPD/GDPR) and other relevant laws.
                    </p>
                </section>

                <section>
                    <h2>2. Data Controller</h2>
                    <p>
                        Controller: Dot&amp;Dot
                        <br />
                        Address: Example Street, 1 — 28000, City (Spain)
                        <br />
                        Contact email: privacy@dotanddot.com
                    </p>
                </section>

                <section>
                    <h2>3. Scope of Application</h2>
                    <p>
                        This policy applies to all personal data that Dot&amp;Dot collects
                        through its website, services, mobile applications, email communications,
                        forms, service contracts, business relationships and any other channel
                        through which personal data is provided to Dot&amp;Dot.
                    </p>
                </section>

                <section>
                    <h2>4. Types of Data We Collect</h2>
                    <p>
                        We may collect, depending on the relationship and contracted services, the
                        following categories of personal data:
                    </p>
                    <ul>
                        <li>Identification data: name, surnames, NIF/CIF when applicable, date of birth.</li>
                        <li>Contact information: postal address, email address, phone numbers.</li>
                        <li>Employment and professional data: company, position, CV data, references.</li>
                        <li>Billing and transaction data: bank details, payment history and invoices.</li>
                        <li>Technical data: IP addresses, browsing data, cookies and other identifiers.</li>
                        <li>Other data: any other information you voluntarily provide for
                            commercial, support or legal reasons.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Processing Purposes</h2>
                    <p>We process personal data for the following purposes:</p>
                    <ul>
                        <li>Provide, manage and improve contracted services.</li>
                        <li>Manage the contractual relationship, including commercial and administrative communication.</li>
                        <li>Process billing, payments, claims and tax and accounting obligations.</li>
                        <li>Respond to inquiries, support requests and manage incidents.</li>
                        <li>Send commercial and promotional communications when consent is obtained
                            or there is a contractual relationship that permits it.</li>
                        <li>Comply with legal, regulatory and security obligations.</li>
                        <li>Analyze and optimize the use of our services through analysis tools.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Legal Basis for Processing</h2>
                    <p>
                        Depending on the purpose, the legal bases for data processing may be:
                    </p>
                    <ul>
                        <li>Consent of the data subject: for commercial communications, newsletters and specific
                            processing requiring express authorization.</li>
                        <li>Contract execution: when processing is necessary to provide a service
                            or comply with a contract signed with the data subject.</li>
                        <li>Legal obligation: when it comes to complying with legal or tax obligations.</li>
                        <li>Legitimate interest: for fraud prevention, service security, administrative management
                            and product improvement, provided the rights and freedoms of the affected party do not prevail.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Data Retention</h2>
                    <p>
                        We will retain personal data for the time necessary to fulfill the described purposes
                        and to meet legal obligations, resolve disputes and enforce our agreements.
                        When data is no longer necessary it will be deleted or anonymized, unless it is necessary to retain it
                        due to legal requirements.
                    </p>
                </section>

                <section>
                    <h2>8. Communications and Transfers</h2>
                    <p>
                        We do not sell personal data. We may share personal data with:
                    </p>
                    <ul>
                        <li>Suppliers and subcontractors that provide technical, administrative, payment or support services.</li>
                        <li>Public authorities when there is a legal obligation or in compliance with legal requirements.</li>
                        <li>Business partners with whom we have agreements to provide joint services, always with the
                            necessary legal guarantees.</li>
                    </ul>
                    <p>
                        When data is transferred outside the European Economic Area, we will ensure appropriate
                        protection mechanisms (standard contractual clauses, adequacy decisions, etc.).
                    </p>
                </section>

                <section>
                    <h2>9. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect personal data against
                        loss, unauthorized access, misuse, disclosure or alteration. These measures include access controls,
                        encryption as needed, incident management and periodic security reviews.
                    </p>
                </section>

                <section>
                    <h2>10. Rights of Data Subjects</h2>
                    <p>
                        Data subjects have, at all times, the rights recognized by data protection regulations:
                    </p>
                    <ul>
                        <li>Right of access: request confirmation about whether we are processing personal data and access to it.</li>
                        <li>Right of rectification: request the correction of inaccurate or incomplete data.</li>
                        <li>Right of erasure (right to be forgotten): request the deletion of data when appropriate.</li>
                        <li>Right of objection: object to processing for reasons related to their particular situation.</li>
                        <li>Right to restriction of processing: request the restriction of processing in certain cases.</li>
                        <li>Right to data portability: receive data in a structured format and, when technically possible,
                            transfer it to another controller.</li>
                        <li>Right to withdraw consent: when processing is based on consent, without affecting the legality
                            of processing prior to withdrawal.</li>
                    </ul>
                    <p>
                        To exercise any right you can send a request to privacy@dotanddot.com indicating the right you wish to
                        exercise and providing a copy of a document that proves your identity. You can also file a complaint with
                        the Spanish Data Protection Agency (AEPD) if you believe your rights have not been respected.
                    </p>
                </section>

                <section>
                    <h2>11. Cookies and Similar Technologies</h2>
                    <p>
                        We use cookies and other technologies to collect technical information about your browsing and to improve the user
                        experience. When accessing our site, a cookie notice will be displayed with information about types of cookies, purposes
                        and how to configure or reject them. You can adjust your preferences at any time through your browser settings.
                    </p>
                </section>

                <section>
                    <h2>12. Minors</h2>
                    <p>
                        Our services are not directed to minors. We do not knowingly collect data from minors without
                        verifiable consent from their parents or guardians. If we detect that we have collected data from a minor without
                        proper authorization we will delete it immediately.
                    </p>
                </section>

                <section>
                    <h2>13. Changes to the Policy</h2>
                    <p>
                        We may update this Privacy Policy occasionally. We will post any changes on this page and,
                        when appropriate, we will notify you by other means (for example, email) to inform you of significant
                        changes.
                    </p>
                </section>

                <section>
                    <h2>14. Contact</h2>
                    <p>
                        If you have questions, requests or wish to exercise your rights, you can contact our Data Protection Officer
                        or the privacy team at:
                    </p>
                    <p>
                        Email: privacy@dotanddot.com
                        <br />
                        Address: Example Street, 1 — 28000, City (Spain)
                    </p>
                </section>

                <footer className="privacy-footer">
                    <p className="privacy-footer-text">
                        Dot&amp;Dot is committed to protecting your privacy and complying with applicable regulations. This policy describes our general
                        practices; if you need specific information about a particular processing, contact us.
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default PrivacyPolicy;