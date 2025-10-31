package com.ecomama.modules.marketplace.infrastructure.storage;

import com.ecomama.shared.exception.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class LocalImageStorageService implements ImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final int MAX_WIDTH = 1920;
    private static final int MAX_HEIGHT = 1920;

    private final Path uploadPath;

    public LocalImageStorageService(@Value("${app.upload.path:uploads/listings}") String uploadPath) {
        this.uploadPath = Paths.get(uploadPath);
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    @Override
    public String store(MultipartFile file, String listingId) throws IOException {
        validateFile(file);

        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String filename = String.format("%s_%s.%s", listingId, UUID.randomUUID(), extension);
        Path listingPath = uploadPath.resolve(listingId);
        Files.createDirectories(listingPath);

        BufferedImage image = ImageIO.read(file.getInputStream());
        if (image == null) {
            throw new ValidationException("Invalid image file");
        }

        BufferedImage resized = resizeImage(image);
        Path filePath = listingPath.resolve(filename);

        String formatName = extension.equals("jpg") ? "jpeg" : extension;
        ImageIO.write(resized, formatName, filePath.toFile());

        return String.format("/uploads/listings/%s/%s", listingId, filename);
    }

    @Override
    public List<String> storeMultiple(List<MultipartFile> files, String listingId) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(store(file, listingId));
        }
        return urls;
    }

    @Override
    public void delete(String imageUrl) {
        try {
            Path path = uploadPath.getParent().resolve(imageUrl.substring(1));
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Failed to delete image: {}", imageUrl, e);
        }
    }

    @Override
    public void deleteAll(List<String> imageUrls) {
        imageUrls.forEach(this::delete);
    }

    @Override
    public byte[] load(String imageUrl) throws IOException {
        Path path = uploadPath.getParent().resolve(imageUrl.substring(1));
        return Files.readAllBytes(path);
    }

    @Override
    public boolean exists(String imageUrl) {
        Path path = uploadPath.getParent().resolve(imageUrl.substring(1));
        return Files.exists(path);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidationException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("File size exceeds maximum allowed size of 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new ValidationException("Invalid file type. Allowed types: JPG, PNG, WebP");
        }

        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (extension == null || !ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new ValidationException("Invalid file extension. Allowed extensions: jpg, jpeg, png, webp");
        }
    }

    private BufferedImage resizeImage(BufferedImage original) {
        int width = original.getWidth();
        int height = original.getHeight();

        if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
            return original;
        }

        double aspectRatio = (double) width / height;
        int newWidth = width;
        int newHeight = height;

        if (width > MAX_WIDTH) {
            newWidth = MAX_WIDTH;
            newHeight = (int) (MAX_WIDTH / aspectRatio);
        }

        if (newHeight > MAX_HEIGHT) {
            newHeight = MAX_HEIGHT;
            newWidth = (int) (MAX_HEIGHT * aspectRatio);
        }

        BufferedImage resized = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resized.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.drawImage(original, 0, 0, newWidth, newHeight, null);
        graphics.dispose();

        return resized;
    }
}
