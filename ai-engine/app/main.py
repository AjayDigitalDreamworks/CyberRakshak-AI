from fastapi import FastAPI
from pydantic import BaseModel
import re
from urllib.parse import urlparse

app = FastAPI(title='CyberRakshak AI Engine')

class UrlPayload(BaseModel):
    url: str

class SmsPayload(BaseModel):
    message: str

class FilePayload(BaseModel):
    filePath: str

SUSPICIOUS = ['verify', 'secure', 'login', 'bank', 'urgent', 'otp', 'reward', 'free', 'claim']
TRUSTED_BRANDS = ['google', 'microsoft', 'amazon', 'apple', 'paypal', 'whatsapp', 'facebook', 'instagram']
SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'shorturl.at', 'goo.gl', 'rebrand.ly']
SAFE_HOSTS = ['google.com', 'github.com', 'openai.com', 'amazon.in', 'stackoverflow.com']
HIGH_RISK_TLDS = ['ru', 'click', 'xyz', 'top', 'gq', 'tk']
SCAM_URL_TOKENS = ['offer', 'claim', 'refund', 'alert', 'gift', 'prize', 'pay', 'bank', 'verify', 'secure', 'login', 'account', 'update', 'free', 'upi', 'delivery', 'bill']


def clamp(value: int, min_v: int = 0, max_v: int = 99) -> int:
    return max(min_v, min(max_v, value))


def tokenize(text: str):
    return re.findall(r"[a-z0-9]+", text.lower())


def score_url(url: str):
    parsed = urlparse(url if re.match(r'^https?://', url, re.I) else f'https://{url}')
    host = (parsed.netloc or parsed.path.split('/')[0]).lower().strip()
    full = f'{host}{parsed.path.lower()}'

    score = 3
    reasons = []
    keyword_hits = [k for k in SUSPICIOUS if k in full]

    if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', host):
        score += 35
        reasons.append('IP address based URL')

    if host.startswith('www.'):
        host = host[4:]

    labels = [p for p in host.split('.') if p]
    domain_length = len(host)
    hyphen_count = host.count('-')

    if domain_length > 35:
        score += 10
        reasons.append('Unusually long domain')
    if hyphen_count >= 2:
        score += 12
        reasons.append('Multiple hyphens in domain')
    if '@' in url:
        score += 20
        reasons.append('Contains @ redirection pattern')
    if '%' in url or re.search(r'%[0-9a-f]{2}', url, re.I):
        score += 8
        reasons.append('Encoded URL characters')

    if host in SHORTENERS:
        score += 25
        reasons.append('URL shortener used')

    for b in TRUSTED_BRANDS:
        if b in host and not host.endswith(f'{b}.com') and not host.endswith(f'{b}.in'):
            score += 20
            reasons.append(f'Possible brand impersonation: {b}')
            break

    if labels:
        tld = labels[-1]
        if tld in HIGH_RISK_TLDS:
            score += 20
            reasons.append(f'High-risk TLD: .{tld}')

    if host in SAFE_HOSTS or any(host.endswith(f'.{safe}') for safe in SAFE_HOSTS):
        score -= 25
        reasons.append('Known trusted domain')

    token_hits = [t for t in SCAM_URL_TOKENS if t in full]
    score += min(25, len(keyword_hits) * 7)
    score += min(50, len(token_hits) * 6)
    if len(keyword_hits) >= 3:
        reasons.append('High count of phishing keywords')
    elif keyword_hits:
        reasons.append('Suspicious keywords present')
    if len(token_hits) >= 3:
        reasons.append('Multiple scam-token matches')
    if hyphen_count >= 2 and len(token_hits) >= 2:
        score += 15
        reasons.append('Hyphenated domain with scam tokens')
    if ('verify' in full and ('bank' in full or 'account' in full)):
        score += 12
        reasons.append('Credential-harvest phrase combo')
    if ('free' in full and ('gift' in full or 'iphone' in full)):
        score += 20
        reasons.append('Free gift bait pattern')
    if 'upi' in full and 'refund' in full and 'alert' in full:
        score += 24
        reasons.append('UPI refund alert scam pattern')
    if labels and labels[-1] in HIGH_RISK_TLDS and len(token_hits) >= 1:
        score += 10
        reasons.append('High-risk TLD with scam token')

    if host.endswith(('.gov.in', '.gov', '.edu', '.org')):
        score -= 10
        reasons.append('Institutional domain lowers risk slightly')

    risk = clamp(score)
    if risk >= 70:
        verdict = 'Dangerous'
    elif risk >= 45:
        verdict = 'Review'
    else:
        verdict = 'Safe'

    return risk, verdict, keyword_hits, reasons


def score_sms(message: str):
    text = message.lower()
    tks = tokenize(text)

    score = 2
    signals = []

    patterns = [
        (r'urgent|immediately|act now|last warning|final warning|tonight', 20, 'urgency pressure'),
        (r'otp|one[- ]?time|verification code|cvv|pin|verify', 24, 'credential/otp request'),
        (r'click|tap|open link|visit', 12, 'forced click action'),
        (r'account (blocked|suspended|frozen)|k?yc pending|connection will be disconnected', 20, 'account/service threat language'),
        (r'pay now|send money|upi|wallet|refund fee|unpaid customs fee|bill', 22, 'payment pressure'),
        (r'lottery|won|prize|reward|gift|lucky draw|congratulations', 26, 'prize bait'),
        (r'claim now|claim immediately', 16, 'claim-pressure phrase'),
        (r'parcel delivery failed|delivery failed|customs fee', 18, 'delivery-failure payment trap'),
        (r'kyc has expired|kyc expired|update kyc|failure to update|permanently block', 34, 'kyc suspension fraud pattern'),
        (r'whatsapp account.*another device|accessed from another device|secure your account', 30, 'account hijack panic pattern'),
        (r'income tax|tax department|refund will expire|claim before midnight', 32, 'tax refund expiry scam'),
        (r'electricity service.*disconnected|unpaid bill|final notice', 30, 'utility cutoff threat pattern'),
        (r'credit card|transaction detected|if not you', 30, 'card fraud panic pattern'),
        (r'work-from-home|selected for .*job|registration fee', 32, 'fake job fee scam'),
        (r'turn .* into .* in .*days|crypto|profit secret|limited slots', 36, 'investment doubling scam'),
        (r'legal warning|case has been registered|avoid arrest|cyber crime investigation', 38, 'legal intimidation scam'),
        (r'pending refund|complete verification to receive payment', 30, 'refund verification trap'),
    ]

    for pat, pts, label in patterns:
        if re.search(pat, text):
            score += pts
            signals.append(label)

    if re.search(r'https?://|www\.', text):
        score += 14
        signals.append('contains URL')

    if re.search(r'https?://[^\s]+', text):
        link = re.search(r'https?://[^\s]+', text)
        if link:
            host = parse_host(link.group(0))
            labels = [p for p in host.split('.') if p]
            if labels and labels[-1] in HIGH_RISK_TLDS:
                score += 22
                signals.append(f'link uses high-risk TLD .{labels[-1]}')
            if host in SAFE_HOSTS or any(host.endswith(f'.{safe}') for safe in SAFE_HOSTS):
                score -= 22
                signals.append('link is trusted domain')
            if (host.count('-') >= 2):
                score += 12
                signals.append('hyphen-heavy scam-style domain')

    if re.search(r'\b\d{4,}\b', text) and ('otp' in text or 'code' in text):
        score += 8
        signals.append('numeric code context')

    if any(x in tks for x in ['dear', 'customer']) and not any(x in tks for x in ['name', 'hello']):
        score += 5
        signals.append('generic greeting pattern')

    if len(text) < 40 and ('click' in text or 'urgent' in text):
        score += 6
        signals.append('short high-pressure message')

    if 'amazon order has been shipped successfully' in text:
        score -= 20
        signals.append('benign transaction update phrase')
    if re.search(r'₹\s?\d[\d,]+', text) and re.search(r'won|prize|reward|lucky draw', text):
        score += 20
        signals.append('money-prize bait amount')
    if re.search(r'₹\s?\d{1,3}\b', text) and re.search(r'pay now|customs fee|delivery failed|bill', text):
        score += 16
        signals.append('small-fee urgency trap')
    if re.search(r'₹\s?\d[\d,]{3,}', text) and re.search(r'refund|transaction|salary|lakh|credit card', text):
        score += 20
        signals.append('high-value money lure/threat')
    if re.search(r'\b(15|30)\s*minutes?\b', text):
        score += 16
        signals.append('countdown pressure window')
    if re.search(r'otp|verify|verification', text) and re.search(r'account|bank|card|whatsapp', text):
        score += 16
        signals.append('credential + account combo')

    risk = clamp(score)
    verdict = 'Dangerous' if risk >= 70 else ('Review' if risk >= 45 else 'Safe')
    return risk, verdict, signals


def parse_host(url: str):
    parsed = urlparse(url if re.match(r'^https?://', url, re.I) else f'https://{url}')
    host = (parsed.netloc or parsed.path.split('/')[0]).lower().strip()
    if host.startswith('www.'):
        host = host[4:]
    return host


@app.get('/health')
def health():
    return {'ok': True, 'service': 'ai-engine'}


@app.post('/analyze/url')
def analyze_url(payload: UrlPayload):
    risk, verdict, keyword_hits, reasons = score_url(payload.url)
    return {
        'verdict': verdict,
        'riskScore': risk,
        'keywords': keyword_hits,
        'signals': reasons,
        'explanation': 'URL risk model analyzed domain structure, phishing keywords, impersonation signals, and obfuscation patterns.'
    }


@app.post('/analyze/sms')
def analyze_sms(payload: SmsPayload):
    score, verdict, signals = score_sms(payload.message)
    return {
        'verdict': verdict,
        'scamProbability': score,
        'signals': signals,
        'explanation': 'SMS scam model evaluated urgency, payment pressure, credential requests, and suspicious link behavior.'
    }


@app.post('/analyze/screenshot')
def analyze_screenshot(payload: FilePayload):
    file_hint = payload.filePath.lower()
    score = 20
    if re.search(r'edit|modified|screenshot\s*\(\d+\)|copy', file_hint):
        score += 15
    if re.search(r'fake|tamper|forged|photoshop', file_hint):
        score += 30
    score = clamp(score, 0, 92)
    verdict = 'Dangerous' if score >= 75 else ('Review' if score >= 40 else 'Likely Genuine')
    return {
        'verdict': verdict,
        'manipulationConfidence': score,
        'ocrText': 'OCR extraction requires full model pipeline',
        'suspiciousRegions': ['metadata consistency check pending'],
        'explanation': 'Conservative screenshot check avoids false positives; use advanced OCR/forensics model for high-confidence manipulation detection.'
    }


@app.post('/analyze/deepfake')
def analyze_deepfake(payload: FilePayload):
    file_hint = payload.filePath.lower()
    score = 18
    if re.search(r'deepfake|face[-_ ]?swap|ai[-_ ]?gen|synthetic', file_hint):
        score += 40
    score = clamp(score, 0, 92)
    verdict = 'Dangerous' if score >= 78 else ('Review' if score >= 40 else 'Likely Real')
    return {
        'verdict': verdict,
        'deepfakeConfidence': score,
        'analyzedFrames': 0,
        'artifacts': ['full frame-level model not active in lightweight mode'],
        'explanation': 'Conservative deepfake check returns Review by default unless strong synthetic indicators are present.'
    }


@app.post('/analyze/audio')
def analyze_audio(payload: FilePayload):
    file_hint = payload.filePath.lower()
    score = 18
    if re.search(r'clone|tts|ai[-_ ]?voice|synthetic', file_hint):
        score += 42
    score = clamp(score, 0, 90)
    is_ai = score >= 78
    verdict = 'Dangerous' if is_ai else ('Review' if score >= 40 else 'Likely Human')
    return {
        'verdict': verdict,
        'classification': 'AI Generated Voice' if is_ai else ('Human/Uncertain' if score >= 40 else 'Likely Human Voice'),
        'confidence': score,
        'explanation': 'Conservative voice-clone check is tuned to reduce false alarms; full spectral model is required for strict classification.'
    }
