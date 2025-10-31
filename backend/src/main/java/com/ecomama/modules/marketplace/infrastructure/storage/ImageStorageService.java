package com.ecomama.modules.marketplace.infrastructure.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageStorageService {

    String store(MultipartFile file, String listingId) throws IOException;

    List<String> storeMultiple(List<MultipartFile> files, String listingId) throws IOException;

    void delete(String imageUrl);

    void deleteAll(List<String> imageUrls);

    byte[] load(String imageUrl) throws IOException;

    boolean exists(String imageUrl);
}
